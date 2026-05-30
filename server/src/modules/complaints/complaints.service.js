/**
 * COMPLAINTS — 3-Tier Banking Grievance Resolution System
 *
 * TIER 1 → Customer Support Agent (Employee)  — SLA: 2 business days
 * TIER 2 → Relationship Manager / Dept Head   — SLA: 7 business days
 * TIER 3 → Nodal Officer (RBI Escalation)     — SLA: 30 calendar days
 *
 * Auto-escalation: checked on every fetch — if SLA breached, tier upgrades.
 */

const prisma = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

// ── SLA Deadlines (business days → ms) ────────
const SLA = {
    TIER_1: 2,   // 2 days
    TIER_2: 7,   // 7 days
    TIER_3: 30,  // 30 days
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const calcSLA = (tier) => addDays(new Date(), SLA[tier] || 2);

// ── Ticket Number Generator ────────────────────
const generateTicketNumber = async () => {
    const year = new Date().getFullYear();
    const count = await prisma.complaint.count();
    return `TKT-${year}-${String(count + 1).padStart(5, '0')}`;
};

// ── Auto-escalation check ──────────────────────
const checkAndEscalate = async (complaint) => {
    const now = new Date();
    if (
        complaint.status !== 'RESOLVED' &&
        complaint.status !== 'CLOSED' &&
        now > new Date(complaint.slaDeadline)
    ) {
        let nextTier = complaint.tier;
        let escalatedToRBI = complaint.escalatedToRBI;

        if (complaint.tier === 'TIER_1') nextTier = 'TIER_2';
        else if (complaint.tier === 'TIER_2') nextTier = 'TIER_3';
        else if (complaint.tier === 'TIER_3') escalatedToRBI = true;

        if (nextTier !== complaint.tier || escalatedToRBI !== complaint.escalatedToRBI) {
            const updated = await prisma.complaint.update({
                where: { id: complaint.id },
                data: {
                    tier: nextTier,
                    status: 'IN_PROGRESS',
                    escalatedAt: now,
                    escalatedToRBI,
                    slaDeadline: calcSLA(nextTier),
                    assignedTo: nextTier === 'TIER_2'
                        ? 'Relationship Manager'
                        : nextTier === 'TIER_3'
                        ? 'Nodal Officer'
                        : complaint.assignedTo,
                },
            });
            logger.info('Complaint auto-escalated', { id: complaint.id, from: complaint.tier, to: nextTier });
            return updated;
        }
    }
    return complaint;
};

// ────────────────────────────────────────────────
// CUSTOMER FUNCTIONS
// ────────────────────────────────────────────────

const submit = async (userId, { category, subject, description, priority, attachmentNote }) => {
    const ticketNumber = await generateTicketNumber();
    const slaDeadline = calcSLA('TIER_1');

    const complaint = await prisma.complaint.create({
        data: {
            userId,
            ticketNumber,
            category,
            subject,
            description,
            priority: priority || 'MEDIUM',
            attachmentNote: attachmentNote || null,
            status: 'OPEN',
            channel: 'APP',
            tier: 'TIER_1',
            slaDeadline,
            assignedTo: 'Customer Support Team',
        },
    });

    logger.info('Complaint submitted', { userId, ticketNumber, category });
    return complaint;
};

const getMyComplaints = async (userId, { page, limit, status, category }) => {
    page  = parseInt(page)  || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const where = { userId };
    if (status)   where.status   = status;
    if (category) where.category = category;

    const [raw, total] = await Promise.all([
        prisma.complaint.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
        prisma.complaint.count({ where }),
    ]);

    // Run auto-escalation check on each
    const complaints = await Promise.all(raw.map(checkAndEscalate));
    return { complaints, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getOne = async (complaintId, userId) => {
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) throw ApiError.notFound('Complaint not found.');
    if (complaint.userId !== userId) throw ApiError.forbidden('Access denied.');
    return checkAndEscalate(complaint);
};

const withdraw = async (complaintId, userId) => {
    const c = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!c) throw ApiError.notFound('Complaint not found.');
    if (c.userId !== userId) throw ApiError.forbidden('Access denied.');
    if (c.status === 'RESOLVED' || c.status === 'CLOSED')
        throw ApiError.badRequest('Cannot withdraw a resolved complaint.');
    return prisma.complaint.update({
        where: { id: complaintId },
        data: { status: 'CLOSED', resolution: 'Withdrawn by customer.' },
    });
};

const getMyStats = async (userId) => {
    const [total, open, inProgress, resolved, closed] = await Promise.all([
        prisma.complaint.count({ where: { userId } }),
        prisma.complaint.count({ where: { userId, status: 'OPEN' } }),
        prisma.complaint.count({ where: { userId, status: 'IN_PROGRESS' } }),
        prisma.complaint.count({ where: { userId, status: 'RESOLVED' } }),
        prisma.complaint.count({ where: { userId, status: 'CLOSED' } }),
    ]);
    return { total, open, inProgress, resolved, closed };
};

// ────────────────────────────────────────────────
// EMPLOYEE FUNCTIONS (Tier 1 — Customer Support)
// ────────────────────────────────────────────────

const getAssignedComplaints = async (employeeId, { page, limit, status }) => {
    page  = parseInt(page)  || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;
    const where = { assignedEmployeeId: employeeId, tier: 'TIER_1' };
    if (status) where.status = status;

    const [raw, total] = await Promise.all([
        prisma.complaint.findMany({
            where,
            orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
            skip, take: limit,
            include: { user: { select: { name: true, email: true } } },
        }),
        prisma.complaint.count({ where }),
    ]);

    const complaints = await Promise.all(raw.map(checkAndEscalate));
    return { complaints, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const respondToComplaint = async (complaintId, employeeId, { responseNote }) => {
    const c = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!c) throw ApiError.notFound('Complaint not found.');
    if (c.tier !== 'TIER_1') throw ApiError.forbidden('This complaint is beyond Tier 1 scope.');

    return prisma.complaint.update({
        where: { id: complaintId },
        data: { responseNote, status: 'IN_PROGRESS', assignedEmployeeId: employeeId },
    });
};

const resolveComplaint = async (complaintId, employeeId, employeeName, { resolution }) => {
    const c = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!c) throw ApiError.notFound('Complaint not found.');
    if (c.status === 'RESOLVED') throw ApiError.badRequest('Already resolved.');

    logger.info('Complaint resolved', { complaintId, by: employeeName });
    return prisma.complaint.update({
        where: { id: complaintId },
        data: {
            status: 'RESOLVED',
            resolution,
            resolvedAt: new Date(),
            assignedEmployeeId: employeeId,
            assignedTo: employeeName,
        },
    });
};

const escalateToTier2 = async (complaintId, employeeId, { reason }) => {
    const c = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!c) throw ApiError.notFound('Complaint not found.');
    if (c.tier !== 'TIER_1') throw ApiError.badRequest('Already escalated.');

    logger.info('Complaint escalated to Tier 2', { complaintId, by: employeeId });
    return prisma.complaint.update({
        where: { id: complaintId },
        data: {
            tier: 'TIER_2',
            status: 'IN_PROGRESS',
            escalatedAt: new Date(),
            slaDeadline: calcSLA('TIER_2'),
            assignedTo: 'Relationship Manager',
            assignedEmployeeId: null,
            responseNote: `Escalated to Tier 2: ${reason}`,
        },
    });
};

// ────────────────────────────────────────────────
// ADMIN FUNCTIONS (Tier 2 & 3 — Full Oversight)
// ────────────────────────────────────────────────

const getAllComplaints = async ({ page, limit, status, tier, category, priority }) => {
    page  = parseInt(page)  || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;
    const where = {};
    if (status)   where.status   = status;
    if (tier)     where.tier     = tier;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (userId)   where.userId   = userId;

    const [raw, total] = await Promise.all([
        prisma.complaint.findMany({
            where,
            orderBy: [{ tier: 'desc' }, { slaDeadline: 'asc' }],
            skip, take: limit,
            include: { user: { select: { name: true, email: true } } },
        }),
        prisma.complaint.count({ where }),
    ]);

    const complaints = await Promise.all(raw.map(checkAndEscalate));
    return { complaints, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const assignToEmployee = async (complaintId, { employeeId, employeeName }) => {
    const c = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!c) throw ApiError.notFound('Complaint not found.');

    return prisma.complaint.update({
        where: { id: complaintId },
        data: {
            assignedEmployeeId: employeeId,
            assignedTo: employeeName,
            status: 'IN_PROGRESS',
        },
    });
};

const adminResolve = async (complaintId, adminName, { resolution }) => {
    const c = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!c) throw ApiError.notFound('Complaint not found.');

    logger.info('Admin resolved complaint', { complaintId, by: adminName });
    return prisma.complaint.update({
        where: { id: complaintId },
        data: {
            status: 'RESOLVED',
            resolution,
            resolvedAt: new Date(),
            assignedTo: adminName,
        },
    });
};

const escalateToTier3 = async (complaintId, adminId) => {
    const c = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!c) throw ApiError.notFound('Complaint not found.');

    return prisma.complaint.update({
        where: { id: complaintId },
        data: {
            tier: 'TIER_3',
            status: 'IN_PROGRESS',
            escalatedAt: new Date(),
            slaDeadline: calcSLA('TIER_3'),
            assignedTo: 'Nodal Officer',
        },
    });
};

const getAdminStats = async () => {
    const now = new Date();
    const [total, open, inProgress, resolved, t1, t2, t3, rbi, breached] = await Promise.all([
        prisma.complaint.count(),
        prisma.complaint.count({ where: { status: 'OPEN' } }),
        prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
        prisma.complaint.count({ where: { status: 'RESOLVED' } }),
        prisma.complaint.count({ where: { tier: 'TIER_1' } }),
        prisma.complaint.count({ where: { tier: 'TIER_2' } }),
        prisma.complaint.count({ where: { tier: 'TIER_3' } }),
        prisma.complaint.count({ where: { escalatedToRBI: true } }),
        prisma.complaint.count({
            where: { slaDeadline: { lt: now }, status: { notIn: ['RESOLVED', 'CLOSED'] } },
        }),
    ]);
    return { total, open, inProgress, resolved, t1, t2, t3, rbi, breached };
};

module.exports = {
    // Customer
    submit, getMyComplaints, getOne, withdraw, getMyStats,
    // Employee
    getAssignedComplaints, respondToComplaint, resolveComplaint, escalateToTier2,
    // Admin
    getAllComplaints, assignToEmployee, adminResolve, escalateToTier3, getAdminStats,
};
