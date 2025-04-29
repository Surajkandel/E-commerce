// Verify admin role
exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Admin privileges required' 
      });
    }
    next();
  };