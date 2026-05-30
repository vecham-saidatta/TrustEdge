/**
 * PULSE FEEDBACK LOOP — Controller
 */
const feedbackService = require('./feedback.service');

const aggregate = async (req, res, next) => {
    try {
        const data = await feedbackService.aggregateFeedback();
        res.json({ status: 'success', data });
    } catch (e) { next(e); }
};

const getInsights = async (req, res, next) => {
    try {
        const data = await feedbackService.getInsights(req.query);
        res.json({ status: 'success', data });
    } catch (e) { next(e); }
};

const getLearningSummary = async (req, res, next) => {
    try {
        const data = await feedbackService.getLearningSummary();
        res.json({ status: 'success', data });
    } catch (e) { next(e); }
};

module.exports = { aggregate, getInsights, getLearningSummary };
