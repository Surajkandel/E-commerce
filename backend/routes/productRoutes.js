// productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const authController = require('../controller/authController');

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for sellers to manage their products
router
  .route('/my-products')
  .get(productController.getMyProducts);

router
  .route('/')
  .post(
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.createProduct
  );

router
  .route('/:id')
  .patch(
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;