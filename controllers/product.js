const db = require('../config/db');
const { validationResult } = require('express-validator');
const { runQuery } = require('../config/db')



exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const offset = (page - 1) * pageSize;

        // Fetch products and categories
        const productsQuery = `
            SELECT p.ProductId, p.ProductName, p.CategoryId, c.CategoryName
            FROM Products p
            JOIN Categories c ON p.CategoryId = c.CategoryId
            ORDER BY p.ProductId ASC
            LIMIT ${offset}, ${pageSize}
        `;
        const products = await runQuery(productsQuery);

        const categoriesQuery = 'SELECT * FROM Categories';
        const categories = await runQuery(categoriesQuery);

        const countQuery = 'SELECT COUNT(*) AS total FROM Products';
        const count = await runQuery(countQuery);

        const totalPages = Math.ceil(count[0].total / pageSize);
        res.render('products', { products, categories, page, totalPages });
    } catch (err) {
        res.status(500).send("Failed to fetch products");
    }
};

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const { ProductName, CategoryId } = req.body;

        if (!ProductName || !CategoryId) {
            return res.status(400).send("ProductName and CategoryId are required");
        }

        const addProductQuery = `
            INSERT INTO Products (ProductName, CategoryId)
            VALUES ('${ProductName}', ${CategoryId});
        `;
        const result = await runQuery(addProductQuery);

        if (result.affectedRows > 0) {
            res.redirect('/products');  // Successful addition
        } else {
            res.status(500).send("Failed to add the product");  // If no rows were inserted
        }
    } catch (err) {
        res.status(500).send("An error occurred while adding the product");
    }
};


// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { ProductId, ProductName, CategoryId } = req.body;

        if (!ProductId || !ProductName || !CategoryId) {
            return res.status(400).send("ProductId, ProductName, and CategoryId are required");
        }

        const updateProductQuery = `
            UPDATE Products SET ProductName = '${ProductName}', CategoryId = ${CategoryId}
            WHERE ProductId = ${ProductId};
        `;
        const result = await runQuery(updateProductQuery);

        if (result.affectedRows > 0) {
            res.redirect('/products');  // Successful update
        } else {
            res.status(404).send("Product not found");  // If no rows were affected
        }
    } catch (err) {
        res.status(500).send("An error occurred while updating the product");
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send("ProductId is required");
        }

        const deleteProductQuery = `DELETE FROM Products WHERE ProductId = ${id}`;
        const result = await runQuery(deleteProductQuery);

        if (result.affectedRows > 0) {
            res.redirect('/products');  // Successful deletion
        } else {
            res.status(404).send("Product not found");  // If no rows were affected
        }
    } catch (err) {
        res.status(500).send("An error occurred while deleting the product");
    }
};
