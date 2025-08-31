const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

// POST -checkout mock
router.post('/checkout/mock', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Build order items with price snapshot
    const items = [];
    for (const line of cart.items) {
      const p = await Product.findById(line.product);
      if (!p) continue; 
      items.push({ product: p._id, qty: line.qty, price: p.price });
    }
    if (items.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      status: 'paid',
      paidAt: new Date()
    });

    // clear cart after "payment"
    cart.items = [];
    await cart.save();

    const populated = await order.populate('items.product');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Checkout failed' });
  }
});

// GET to list users orders, most recent first 
router.get('/orders/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;
