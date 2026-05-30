/**
 * TRUTH — Controller
 */

const truthService = require('./truth.service');
const ApiResponse = require('../../utils/apiResponse');

const getProducts = async (req, res, next) => {
    try {
        const { products, pagination } = await truthService.getProducts(req.query);
        return ApiResponse.paginated(res, 'Products retrieved.', products, pagination);
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await truthService.getProductById(req.params.id);
        return ApiResponse.success(res, 200, 'Product details retrieved.', { product });
    } catch (error) {
        next(error);
    }
};

const compareProduct = async (req, res, next) => {
    try {
        const comparison = await truthService.compareProduct(req.user.id, req.body);
        return ApiResponse.success(res, 200, 'Product analysis complete.', { comparison });
    } catch (error) {
        next(error);
    }
};

const getComparisons = async (req, res, next) => {
    try {
        const { comparisons, pagination } = await truthService.getComparisons(req.user.id, req.query);
        return ApiResponse.paginated(res, 'Comparison history retrieved.', comparisons, pagination);
    } catch (error) {
        next(error);
    }
};

module.exports = { getProducts, getProductById, compareProduct, getComparisons };
