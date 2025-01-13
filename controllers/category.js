const db = require('../config/db');
const { validationResult } = require('express-validator');
const { runQuery } = require("../config/db");


// Get all categories
exports.getCategory = async (req, res) => {
    try {
        const getCategoryQuery = `SELECT * FROM categories`;
        const getCategoryQueryRes = await runQuery(getCategoryQuery);

        if (getCategoryQueryRes.length > 0) {
            res.render('categories', { categories: getCategoryQueryRes });
        } else {
            res.status(404).json({ message: "No categories found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add Category
exports.insertCategory = async (req, res) => {
    try {
        const { CategoryName } = req.body;
        if (!CategoryName) {
            return res.status(400).json({ message: "CategoryName is required" });
        }

        const insertCategoryQuery = `INSERT INTO categories (CategoryName) VALUES ('${CategoryName}')`;
        const insertCategoryQueryRes = await runQuery(insertCategoryQuery);

        if (insertCategoryQueryRes.affectedRows > 0) {
            res.redirect('/categories');
        } else {
            res.status(500).json({ message: "Failed to add category" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { categoryName, categoryId } = req.body;
        console.log(categoryId,categoryName )

        // Database update query
        const updateCategoryQuery = `UPDATE categories SET CategoryName = '${categoryName}' WHERE CategoryId = ${categoryId}`;
        const updateCategoryQueryRes = await runQuery(updateCategoryQuery);

        if (updateCategoryQueryRes.affectedRows > 0) {
            res.redirect('/categories'); // Redirect to categories list
        } else {
            res.status(404).json({ message: "Category not found or not updated" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const deleteCategoryQuery = `DELETE FROM categories WHERE CategoryId = ${categoryId}`;
        const deleteCategoryQueryRes = await runQuery(deleteCategoryQuery);

        if (deleteCategoryQueryRes.affectedRows > 0) {
            res.redirect('/categories');
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
