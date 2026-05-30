/**
 * SAGE — Controller
 */

const sageService = require('./sage.service');
const ApiResponse = require('../../utils/apiResponse');

const chat = async (req, res, next) => {
    try {
        const conversation = await sageService.chat(req.user.id, req.body);
        return ApiResponse.success(res, 200, 'SAGE response generated.', { conversation });
    } catch (error) {
        next(error);
    }
};

const translate = async (req, res, next) => {
    try {
        const { text, targetLanguage } = req.body;
        const translatedText = await sageService.translateText(text, targetLanguage);
        return ApiResponse.success(res, 200, 'Translation completed.', { translatedText });
    } catch (error) {
        next(error);
    }
};

const getHistory = async (req, res, next) => {
    try {
        const { conversations, pagination } = await sageService.getHistory(req.user.id, req.query);
        return ApiResponse.paginated(res, 'Chat history retrieved.', conversations, pagination);
    } catch (error) {
        next(error);
    }
};

const recordFeedback = async (req, res, next) => {
    try {
        const conversation = await sageService.recordFeedback(req.params.id, req.user.id, req.body);
        return ApiResponse.success(res, 200, 'Feedback recorded. Thank you!', { conversation });
    } catch (error) {
        next(error);
    }
};
const getSuggestions = async (req, res, next) => {
    try {
        const { suggestions, engine } = await sageService.getSuggestions(req.user.id);
        return ApiResponse.success(res, 200, 'Smart suggestions generated.', { suggestions, engine });
    } catch (error) {
        next(error);
    }
};

const clearHistory = async (req, res, next) => {
    try {
        const result = await sageService.clearHistory(req.user.id);
        return ApiResponse.success(res, 200, 'Chat history cleared.', result);
    } catch (error) {
        next(error);
    }
};

module.exports = { chat, translate, getHistory, recordFeedback, getSuggestions, clearHistory };

