const { CustomError } = require('../utils/errors');

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const expectedApiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
        return next(new CustomError('Unauthorized: Invalid or missing API key', 401));
    }
    next();
};

module.exports = authenticate;
