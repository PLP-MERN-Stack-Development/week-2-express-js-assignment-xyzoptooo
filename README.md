# 📦 Express.js Products API

## 🔥 Overview
This project is a RESTful API built with Express.js to manage a list of products. It supports full CRUD operations, middleware for logging and validation, custom error handling, and advanced features like filtering, search, and pagination.

## 📁 Project Structure
```
week-2-express-js-assignment-xyzoptooo/
├── src/
│   ├── server.js               # Main Express server setup and app initialization
│   ├── routes/
│   │   └── productRoutes.js    # Product-related API routes and handlers
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware (currently unused)
│   │   ├── logger.js           # Request logging middleware
│   │   └── productValidation.js # Product input validation middleware
│   ├── utils/
│   │   └── errors.js           # Custom error classes for error handling
│   └── ...                    # Other utility or helper modules
├── package.json                # Project metadata and scripts
├── README.md                  # This file
└── ...
```

## 🧰 Technologies Used
- Node.js
- Express.js
- Body-Parser (for parsing JSON request bodies)
- UUID (for generating unique product IDs)
- Dotenv (for environment variable management)

## 🚀 Getting Started

1. Clone the repository and navigate to the project directory:
```bash
git clone https://github.com/PLP-MERN-Stack-Development/week-2-express-js-assignment-xyzoptooo.git
cd week-2-express-js-assignment-xyzoptooo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file if needed (optional):
```bash
cp .env.example .env
```

4. Start the server:
```bash
node src/server.js
```

The server will run at [http://localhost:3000](http://localhost:3000).

## 📚 API Endpoints

| Method | Endpoint               | Description                      | Protected (Auth) |
|--------|------------------------|--------------------------------|------------------|
| GET    | /                      | Root route with welcome message | No               |
| GET    | /api/products          | List all products (supports filtering, search, pagination) | No               |
| GET    | /api/products/:id      | Get a product by ID             | No               |
| GET    | /api/products/stats    | Get product statistics          | No               |
| POST   | /api/products          | Create a new product            | No (auth removed)|
| PUT    | /api/products/:id      | Update an existing product      | No (auth removed)|
| DELETE | /api/products/:id      | Delete a product                | No (auth removed)|

## ✨ Features

- **Filtering**: Filter products by category using query parameter `?category=electronics`.
- **Search**: Search products by name or description using `?search=keyword`.
- **Pagination**: Paginate results with `?page=1&limit=10`.
- **Statistics**: Get product stats like count by category, in-stock/out-of-stock counts, average price.

## 🛡️ Middleware and Error Handling

- **Logger Middleware**: Logs incoming requests.
- **Validation Middleware**: Validates product data on create and update.
- **Custom Errors**: Uses custom error classes for validation and not found errors.
- **Global Error Handler**: Catches and responds with appropriate HTTP status codes and messages.

## 🧪 Testing the API

You can test the API endpoints using tools like:

- Postman or Insomnia for sending HTTP requests.
- curl from the command line, e.g.:
```bash
curl http://localhost:3000/api/products
```

## 🔧 Notes

- Authentication middleware was removed from POST, PUT, DELETE routes to allow testing without authorization.
- Products are stored in-memory in the server instance and reset on server restart.
