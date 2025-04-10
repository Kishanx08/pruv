const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Handle
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.redirect('/login');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect('/login');

    req.session.user = user;
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;