const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,                // must be defined
    { expiresIn: '7d' }
  );
}

router.post('/login', async (req, res) => {
  try {
    const { email = '', password = '' } = req.body;
    const normalized = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalized });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;
