const db = require('../config/db');
const { runQuery } = require("../config/db");

// Get all categories
exports.getCategory = async (req, res) => {
    try {
        // Query to fetch all categories from the database
        const getCategoryQuery = `SELECT * FROM categories`;
        const getCategoryQueryRes = await runQuery(getCategoryQuery);

        // Check if categories are found
        if (getCategoryQueryRes.length > 0) {
            // Render the 'categories' page with the fetched categories
            res.render('categories', { categories: getCategoryQueryRes });
        } else {
            res.status(404).json({ message: "No categories found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new category
exports.insertCategory = async (req, res) => {
    try {
        const { CategoryName } = req.body; // Extract category name from the request body

        // Validate if CategoryName is provided
        if (!CategoryName) {
            return res.status(400).json({ message: "CategoryName is required" });
        }

        // Query to insert a new category into the database
        const insertCategoryQuery = `INSERT INTO categories (CategoryName) VALUES ('${CategoryName}')`;
        const insertCategoryQueryRes = await runQuery(insertCategoryQuery);

        // Check if the insertion was successful
        if (insertCategoryQueryRes.affectedRows > 0) {
            res.redirect('/categories'); // Redirect to the categories list
        } else {
            res.status(500).json({ message: "Failed to add category" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an existing category
exports.updateCategory = async (req, res) => {
    try {
        const { categoryName, categoryId } = req.body; // Extract category details from the request body
        console.log(categoryId, categoryName);

        // Query to update the category name in the database
        const updateCategoryQuery = `UPDATE categories SET CategoryName = '${categoryName}' WHERE CategoryId = ${categoryId}`;
        const updateCategoryQueryRes = await runQuery(updateCategoryQuery);

        // Check if the update was successful
        if (updateCategoryQueryRes.affectedRows > 0) {
            res.redirect('/categories'); // Redirect to the categories list
        } else {
            res.status(404).json({ message: "Category not found or not updated" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // Extract the category ID from the request parameters

        // Validate if categoryId is provided
        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        // Query to delete the category from the database
        const deleteCategoryQuery = `DELETE FROM categories WHERE CategoryId = ${categoryId}`;
        const deleteCategoryQueryRes = await runQuery(deleteCategoryQuery);

        // Check if the deletion was successful
        if (deleteCategoryQueryRes.affectedRows > 0) {
            res.redirect('/categories'); // Redirect to the categories list
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
