const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

// Routes for category CRUD operations
router.get('/', productController.getProducts);
router.post('/add', productController.addProduct);
router.post('/update', productController.updateProduct);
router.post('/delete/:id', productController.deleteProduct);

module.exports = router;