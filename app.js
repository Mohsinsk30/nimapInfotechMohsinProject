const express = require('express');
const router = express.Router();
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');

const app = express();

// Middleware to parse JSON and URL-encoded data (express built-in middlewares)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Define Routes
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);  // This line ensures category routes are used

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to the CRUD app');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
