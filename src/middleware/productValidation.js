// src/middleware/productValidation.js

const { ValidationError } = require('../utils/errors');

const validateProduct = (req, res, next) => {
    const { name, description, price, category, inStock } = req.body;

    if (req.method === 'POST') {
        if (!name || !description || !price || !category || typeof inStock === 'undefined') {
            return next(new ValidationError('All fields (name, description, price, category, inStock) are required for product creation.'));
        }
        if (typeof price !== 'number' || price <= 0) {
            return next(new ValidationError('Price must be a positive number.'));
        }
        if (typeof inStock !== 'boolean') {
            return next(new ValidationError('inStock must be a boolean.'));
        }
    } else if (req.method === 'PUT') {
        let hasUpdateField = false;
        if (name) hasUpdateField = true;
        if (description) hasUpdateField = true;
        if (price !== undefined) {
            hasUpdateField = true;
            if (typeof price !== 'number' || price <= 0) {
                return next(new ValidationError('Price must be a positive number if provided.'));
            }
        }
        if (category) hasUpdateField = true;
        if (inStock !== undefined) {
            hasUpdateField = true;
            if (typeof inStock !== 'boolean') {
                return next(new ValidationError('inStock must be a boolean if provided.'));
            }
        }
        if (!hasUpdateField) {
             return next(new ValidationError('At least one field (name, description, price, category, inStock) must be provided for update.'));
        }
    }
    next();
};

module.exports = validateProduct;