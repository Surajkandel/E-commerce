// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
      minlength: [3, 'Product name must be at least 3 characters']
    },
    description: {
      type: String,
      required: [true, 'A product must have a description'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
      min: [0, 'Price must be at least 0']
    },
    category: {
      type: String,
      required: [true, 'A product must belong to a category'],
      enum: {
        values: ['electronics', 'clothing', 'home', 'books', 'beauty', 'sports', 'other'],
        message: 'Invalid product category'
      }
    },
    stock: {
      type: Number,
      required: [true, 'A product must have stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: {
      type: [String],
      validate: {
        validator: function(images) {
          return images.length > 0;
        },
        message: 'A product must have at least one image'
      }
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A product must belong to a seller']
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Indexes for better performance
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });

// Virtual populate reviews (to avoid storing reviews in product)
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

// Middleware to populate seller info when querying products
productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'seller',
    select: 'name email'
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;