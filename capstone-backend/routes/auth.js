// register/login end points//

const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /auth/register  -> { name, email, password }
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body; 
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, role }); 
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', detail: err.message });
  }
});

// POST /auth/login -> { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // +password because schema hides it by default
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(400).json({ message: 'Login failed', detail: err.message });
  }
});

module.exports = router;
