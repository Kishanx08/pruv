const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Middleware to check if user is logged in
function ensureAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// Dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    let vehicles;
    if (req.session.user.role === 'master') {
      vehicles = await Vehicle.find().populate('uploadedBy');
    } else {
      vehicles = await Vehicle.find({ uploadedBy: req.session.user._id }).populate('uploadedBy');
    }
    res.render('admin/dashboard', { user: req.session.user, vehicles });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

module.exports = router;