// routes/cart.js
const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');

// GET /cart -> returns current user's cart; creates empty one if missing
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    // IMPORTANT: return the whole cart, not cart.items
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart' });
  }
});

module.exports = router;
