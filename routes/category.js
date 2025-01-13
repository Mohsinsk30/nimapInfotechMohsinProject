const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

// Routes for category CRUD operations
router.get('/', categoryController.getCategory);
router.post('/add',  categoryController.insertCategory);
router.post('/update/:categoryId', categoryController.updateCategory);
router.post('/delete/:categoryId', categoryController.deleteCategory);

module.exports = router;