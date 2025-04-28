const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// @route   GET api/admin/pending-sellers
// @desc    Get all pending sellers
// @access  Admin only
router.get('/pending-sellers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const pendingSellers = await User.find({ role: 'seller', status: 'pending' });
    res.json(pendingSellers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/approve-seller/:id
// @desc    Approve a seller
// @access  Admin only
router.post('/approve-seller/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ msg: 'Seller not found' });
    }

    seller.status = 'approved';
    await seller.save();

    res.json({ msg: 'Seller approved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/admin/reject-seller/:id
// @desc    Reject a seller
// @access  Admin only
router.post('/reject-seller/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);

    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ msg: 'Seller not found' });
    }

    seller.status = 'rejected';
    await seller.save();

    res.json({ msg: 'Seller rejected successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
