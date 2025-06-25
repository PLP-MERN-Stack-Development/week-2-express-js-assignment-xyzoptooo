// server.js - Main Express server for Week 2 assignment
// This file imports and integrates modules from src/ folders.

// Import core required modules
const express = require('express');
const bodyParser = require('body-parser'); // Keeping bodyParser as per your request
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const dotenv = require('dotenv'); // Import dotenv to load environment variables

// Load environment variables from .env file.
// This should be called early to make process.env available throughout the app.
dotenv.config();

// Import custom middleware
const logger = require('./middleware/logger'); // Path from server.js to middleware
const validateProduct = require('./middleware/productValidation'); // Path from server.js to middleware

// Import custom error classes
const { CustomError, NotFoundError, ValidationError } = require('./utils/errors'); // Path from server.js to utils

// Import routes module
const productRoutes = require('./routes/productRoutes'); // Path from server.js to routes

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Sample in-memory products database (remains in the main app file for simplicity in this structure)
let products = [
    {
        id: '1',
        name: 'Laptop',
        description: 'High-performance laptop with 16GB RAM',
        price: 1200,
        category: 'electronics',
        inStock: true
    },
    {
        id: '2',
        name: 'Smartphone',
        description: 'Latest model with 128GB storage',
        price: 800,
        category: 'electronics',
        inStock: true
    },
    {
        id: '3',
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with timer',
        price: 50,
        category: 'kitchen',
        inStock: false
    },
    // --- START: Added more products ---
    {
        id: '4',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with adjustable DPI',
        price: 25,
        category: 'accessories',
        inStock: true
    },
    {
        id: '5',
        name: 'Mechanical Keyboard',
        description: 'RGB backlit keyboard with clicky switches',
        price: 90,
        category: 'accessories',
        inStock: true
    },
    {
        id: '6',
        name: 'Blender',
        description: 'High-speed blender for smoothies and shakes',
        price: 70,
        category: 'kitchen',
        inStock: true
    },
    {
        id: '7',
        name: 'Smartwatch',
        description: 'Fitness tracker with heart rate monitor',
        price: 150,
        category: 'wearables',
        inStock: false
    },
    {
        id: '8',
        name: 'External SSD',
        description: '1TB portable solid-state drive for fast storage',
        price: 100,
        category: 'electronics',
        inStock: true
    }

];

// --- Middleware Setup (Global) ---

app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(logger);            // Custom request logging middleware

// --- Make the products array accessible to routers ---
// This allows productRoutes.js to access and modify the 'products' array.
app.set('products', products);

// --- Root Route ---

app.get('/', (req, res) => {
    res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// --- Mount Product Routes ---
// All routes defined in productRoutes.js will now be accessible under the /api/products base path.
app.use('/api/products', productRoutes);

// --- Global Error Handling Middleware ---
// This MUST be the very last middleware registered in your application,
// after all other app.use() and app.get/post/put/delete() calls.
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack for debugging purposes

    // If it's one of our custom errors (from src/utils/errors.js), use its defined status code and message
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // For any other unexpected errors, send a generic 500 response
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('\n--- API Endpoints ---');
    console.log(`- GET /`);
    console.log(`- GET /api/products (Supports query: ?category, ?search, ?page, ?limit)`);
    console.log(`- GET /api/products/:id`);
    console.log(`- GET /api/products/stats`);
    console.log(`- POST /api/products`); 
    console.log(`- PUT /api/products/:id`); 
    console.log(`- DELETE /api/products/:id`); 
});

// Export the app for testing purposes
module.exports = app;