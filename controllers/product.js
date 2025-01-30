const db = require('../config/db');
const { runQuery } = require('../config/db');

// Function to get products with pagination and category data
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Parse page number
        const pageSize = 10; // Define items per page
        const offset = (page - 1) * pageSize; // Calculate offset for pagination

        // Query to fetch products with their category names, price, and quantity
        const productsQuery = `
            SELECT p.ProductId, p.ProductName, p.CategoryId, p.Price, p.Quantity, c.CategoryName
            FROM Products p
            JOIN Categories c ON p.CategoryId = c.CategoryId
            ORDER BY p.ProductId ASC
            LIMIT ${offset}, ${pageSize}
        `;
        const products = await runQuery(productsQuery);

        // Query to fetch all categories
        const categoriesQuery = 'SELECT * FROM Categories';
        const categories = await runQuery(categoriesQuery);

        // Query to get total product count
        const countQuery = 'SELECT COUNT(*) AS total FROM Products';
        const count = await runQuery(countQuery);

        // Calculate total pages for pagination
        const totalPages = Math.ceil(count[0].total / pageSize);

        // Render the products page with all data
        res.render('products', { products, categories, page, totalPages });
    } catch (err) {
        res.status(500).send("Failed to fetch products");
    }
};

// Function to add a new product
exports.addProduct = async (req, res) => {
    try {
        const { ProductName, CategoryId, Price, Quantity } = req.body; // Extract product details

        // Validate the presence of required fields
        if (!ProductName || !CategoryId || !Price || !Quantity) {
            return res.status(400).send("ProductName, CategoryId, Price, and Quantity are required");
        }

        // SQL query to insert the new product into the database
        const addProductQuery = `
            INSERT INTO Products (ProductName, CategoryId, Price, Quantity)
            VALUES ('${ProductName}', ${CategoryId}, ${Price}, ${Quantity});
        `;
        const result = await runQuery(addProductQuery);

        // Redirect to the products page if successful
        if (result.affectedRows > 0) {
            res.redirect('/products');
        } else {
            res.status(500).send("Failed to add the product");
        }
    } catch (err) {
        res.status(500).send("An error occurred while adding the product");
    }
};

// Function to update an existing product
exports.updateProduct = async (req, res) => {
    try {
        const { ProductId, ProductName, CategoryId, Price, Quantity } = req.body; // Extract product details

        // Validate the presence of required fields
        if (!ProductId || !ProductName || !CategoryId || !Price || !Quantity) {
            return res.status(400).send("ProductId, ProductName, CategoryId, Price, and Quantity are required");
        }

        // SQL query to update the product in the database
        const updateProductQuery = `
            UPDATE Products 
            SET ProductName = '${ProductName}', 
                CategoryId = ${CategoryId}, 
                Price = ${Price}, 
                Quantity = ${Quantity}
            WHERE ProductId = ${ProductId};
        `;
        const result = await runQuery(updateProductQuery);

        // Redirect to the products page if successful
        if (result.affectedRows > 0) {
            res.redirect('/products');
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        res.status(500).send("An error occurred while updating the product");
    }
};

// Function to delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Extract the product ID

        // Validate the presence of the product ID
        if (!id) {
            return res.status(400).send("ProductId is required");
        }

        // SQL query to delete the product from the database
        const deleteProductQuery = `DELETE FROM Products WHERE ProductId = ${id}`;
        const result = await runQuery(deleteProductQuery);

        // Redirect to the products page if successful
        if (result.affectedRows > 0) {
            res.redirect('/products');
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        res.status(500).send("An error occurred while deleting the product");
    }
};
