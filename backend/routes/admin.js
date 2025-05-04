const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

/*
 * @route   GET /api/admin/all-users+
 * @desc    Get all users (excluding passwords)
 * @access  Admin only
 */
router.get('/all-users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 }); // Newest first
      
    res.json({ 
      success: true,
      count: users.length,
      users 
    });
  } catch (err) {
    console.error('Admin fetch error:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/*
 * @rout   GET /api/admin/pending-sellers
 * @desc    Get pending sellers with business info
 * @access  Admin only
 */
router.get('/pending-sellers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log('Fetching pending sellers...');
    const sellers = await User.find({ 
      role: 'seller', 
      status: 'pending' 
    })
    .select('-password -__v')
    .populate('businessInfo', 'businessName taxId'); // If businessInfo is a reference
    console.log('Found sellers:', sellers.length); 

    res.json({ 
      success: true,
      count: sellers.length,
      sellers 
    });
  } catch (err) {
    console.error('Pending sellers error:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/*
 * @route   PATCH /api/admin/approve-seller/:id
 * @desc    Approve a seller application
 * @access  Admin only
 */
router.patch('/approve-seller/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const seller = await User.findOneAndUpdate(
      { 
        _id: req.params.id, 
        role: 'seller',
        status: 'pending' // Ensure only pending sellers can be approved
      },
      { status: 'approved' },
      { new: true, runValidators: true }
    ).select('-password');

    if (!seller) {
      return res.status(404).json({ 
        success: false,
        error: 'Seller not found or already processed' 
      });
    }

    res.json({ 
      success: true,
      message: 'Seller approved',
      seller 
    });
  } catch (err) {
    console.error('Approval error:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

/*
 * @route   PATCH /api/admin/reject-seller/:id
 * @desc    Reject a seller application with optional reason
 * @access  Admin only
 */
router.patch('/reject-seller/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const seller = await User.findOneAndUpdate(
      { 
        _id: req.params.id, 
        role: 'seller',
        status: 'pending' // Ensure only pending sellers can be rejected
      },
      { 
        status: 'rejected',
        ...(rejectionReason && { rejectionReason }) // Optional field
      },
      { new: true }
    ).select('-password');

    if (!seller) {
      return res.status(404).json({ 
        success: false,
        error: 'Seller not found or already processed' 
      });
    }

    res.json({ 
      success: true,
      message: 'Seller rejected',
      seller 
    });
  } catch (err) {
    console.error('Rejection error:', err.message);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

module.exports = router;