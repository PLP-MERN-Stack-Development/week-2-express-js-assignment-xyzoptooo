// src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


const validateProduct = require('../middleware/productValidation');
const authenticate = require('../middleware/auth');
const { NotFoundError, ValidationError } = require('../utils/errors');


// Removed static productsData array and global variable

// GET /api/products: List all products
router.get('/', (req, res, next) => {
    try {
        let productsData = req.app.get('products') || [];
        let currentProducts = [...productsData];

        const { category, search, page = 1, limit = 10 } = req.query;

        if (category) {
            currentProducts = currentProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (search) {
            const searchTerm = search.toLowerCase();
            currentProducts = currentProducts.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);

        if (isNaN(parsedPage) || parsedPage < 1) {
            return next(new ValidationError('Page parameter must be a positive number.'));
        }
        if (isNaN(parsedLimit) || parsedLimit < 1) {
            return next(new ValidationError('Limit parameter must be a positive number.'));
        }

        const startIndex = (parsedPage - 1) * parsedLimit;
        const endIndex = parsedPage * parsedLimit;

        const paginatedProducts = currentProducts.slice(startIndex, endIndex);

        res.json({
            totalProducts: currentProducts.length,
            currentPage: parsedPage,
            perPage: parsedLimit,
            products: paginatedProducts
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/products/stats: Get product statistics
router.get('/stats', (req, res) => {
    let productsData = req.app.get('products') || [];
    const stats = {};
    productsData.forEach(product => {
        stats[product.category] = (stats[product.category] || 0) + 1;
    });

    const inStockCount = productsData.filter(p => p.inStock).length;
    const outOfStockCount = productsData.filter(p => !p.inStock).length;
    const totalPrices = productsData.reduce((sum, p) => sum + p.price, 0);
    const averagePrice = productsData.length > 0 ? totalPrices / productsData.length : 0;

    res.json({
        totalProducts: productsData.length,
        countByCategory: stats,
        inStock: inStockCount,
        outOfStock: outOfStockCount,
        averagePrice: parseFloat(averagePrice.toFixed(2))
    });
});

// GET /api/products/:id: Get a specific product by ID
router.get('/:id', (req, res, next) => {
    console.log(`GET /api/products/${req.params.id} called`);
    let productsData = req.app.get('products') || [];
    const product = productsData.find(p => p.id === req.params.id);
    if (!product) {
        console.log(`Product with id ${req.params.id} not found`);
        return next(new NotFoundError('Product not found'));
    }
    console.log(`Product found: ${JSON.stringify(product)}`);
    res.json(product);
});

// POST /api/products: Create a new product 
router.post('/', validateProduct, (req, res, next) => {
    console.log('POST /api/products called with body:', req.body);
    try {
        let productsData = req.app.get('products') || [];
        const newProduct = {
            id: uuidv4(),
            ...req.body,
        };
        productsData.push(newProduct);
        // Update the app's products array to keep in sync
        req.app.set('products', productsData);
        console.log('New product created:', newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        next(error);
    }
});

// PUT /api/products/:id: Update an existing product (Removed 'authenticate')
router.put('/:id', validateProduct, (req, res, next) => {
    try {
        let productsData = req.app.get('products') || [];
        const productId = req.params.id;
        let productIndex = productsData.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return next(new NotFoundError('Product not found'));
        }

        productsData[productIndex] = { ...productsData[productIndex], ...req.body };
        // Update the app's products array to keep in sync
        req.app.set('products', productsData);
        res.json(productsData[productIndex]);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', (req, res, next) => {
    try {
        let productsData = req.app.get('products') || [];
        const productId = req.params.id;
        const initialLength = productsData.length;
        productsData = productsData.filter(p => p.id !== productId);
        // Update the app's products array to keep in sync
        req.app.set('products', productsData);

        if (productsData.length === initialLength) {
            return next(new NotFoundError('Product not found'));
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

module.exports = router;