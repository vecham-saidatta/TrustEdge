/**
 * SAGE — Routes
 */

const { Router } = require('express');
const controller = require('./sage.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const { chatSchema, historyQuery, feedbackSchema, translateSchema } = require('./sage.validation');

const router = Router();

router.use(authenticate);
router.use(authorize('CUSTOMER'));

router.post('/chat', validate(chatSchema), controller.chat);
router.post('/translate', validate(translateSchema), controller.translate);
router.get('/history', validate(historyQuery, 'query'), controller.getHistory);
router.get('/suggestions', controller.getSuggestions);
router.delete('/history', controller.clearHistory);
router.patch('/feedback/:id', validate(feedbackSchema), controller.recordFeedback);

module.exports = router;

