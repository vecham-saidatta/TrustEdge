const ApiResponse = require('../../utils/apiResponse');
const svc = require('./complaints.service');

// ── Customer ───────────────────────────────────
const submit              = async (req, res, next) => { try { const c = await svc.submit(req.user.id, req.body); return ApiResponse.success(res, 201, 'Complaint submitted.', { complaint: c }); } catch(e){next(e);} };
const getMyComplaints     = async (req, res, next) => { try { const r = await svc.getMyComplaints(req.user.id, req.query); return res.json({ success:true, message:'OK', data: r.complaints, pagination: r.pagination }); } catch(e){next(e);} };
const getOne              = async (req, res, next) => { try { const c = await svc.getOne(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'OK', { complaint: c }); } catch(e){next(e);} };
const withdraw            = async (req, res, next) => { try { const c = await svc.withdraw(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'Withdrawn.', { complaint: c }); } catch(e){next(e);} };
const getMyStats          = async (req, res, next) => { try { const s = await svc.getMyStats(req.user.id); return ApiResponse.success(res, 200, 'OK', { stats: s }); } catch(e){next(e);} };

// ── Admin ──────────────────────────────────────
const getAll              = async (req, res, next) => { try { const r = await svc.getAllComplaints(req.query); return res.json({ success:true, message:'OK', data: r.complaints, pagination: r.pagination }); } catch(e){next(e);} };

const adminResolve        = async (req, res, next) => { try { const c = await svc.adminResolve(req.params.id, req.user.name, req.body); return ApiResponse.success(res, 200, 'Resolved.', { complaint: c }); } catch(e){next(e);} };
const escalateT3          = async (req, res, next) => { try { const c = await svc.escalateToTier3(req.params.id, req.user.id); return ApiResponse.success(res, 200, 'Escalated to Tier 3.', { complaint: c }); } catch(e){next(e);} };
const getAdminStats       = async (req, res, next) => { try { const s = await svc.getAdminStats(); return ApiResponse.success(res, 200, 'OK', { stats: s }); } catch(e){next(e);} };

module.exports = { submit, getMyComplaints, getOne, withdraw, getMyStats, getAll, adminResolve, escalateT3, getAdminStats };
