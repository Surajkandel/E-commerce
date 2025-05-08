// productController.js
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMyProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ seller: req.seller._id });
  
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  
  const newProduct = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    seller: req.seller._id,
    images: req.files?.map(file => file.filename) || []
  });

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.seller._id
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  const { name, description, price, category, stock } = req.body;
  
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.stock = stock || product.stock;
  
  // Add new images if any
  if (req.files && req.files.length > 0) {
    product.images = [...product.images, ...req.files.map(file => file.filename)];
  }

  await product.save();

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    seller: req.seller._id
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Middleware for handling image uploads
exports.uploadProductImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();
  
  // Process images here (using multer or similar)
  next();
};

exports.resizeProductImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();
  
  // Resize images here if needed
  next();
};