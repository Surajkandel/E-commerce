import React, { useState } from 'react';
import axios from 'axios';

const SellerDashboard = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: []
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setProductData({
      ...productData,
      images: Array.from(e.target.files)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
      
      productData.images.forEach(image => {
        formData.append('images', image);
      });

      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      // Reset form after successful submission
      setProductData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="seller-dashboard">
      <h2>Add New Product</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Product added successfully!</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Product Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default SellerDashboard;