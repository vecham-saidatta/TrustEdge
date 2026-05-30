/**
 * TRUTH — Routes
 */

const { Router } = require('express');
const controller = require('./truth.controller');
const authenticate = require('../../middleware/auth');
const authorize = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const { productsQuery, compareSchema, comparisonsQuery } = require('./truth.validation');

const router = Router();

router.use(authenticate);

router.get('/products', authorize('CUSTOMER', 'EMPLOYEE', 'ADMIN'), validate(productsQuery, 'query'), controller.getProducts);
router.get('/products/:id', authorize('CUSTOMER', 'EMPLOYEE', 'ADMIN'), controller.getProductById);
router.post('/compare', authorize('CUSTOMER'), validate(compareSchema), controller.compareProduct);
router.get('/comparisons', authorize('CUSTOMER'), validate(comparisonsQuery, 'query'), controller.getComparisons);

module.exports = router;
