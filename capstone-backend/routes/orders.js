const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

router.get('/orders/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

router.get('/orders/stripe/success', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart empty' });
    }

    const items = cart.items.map((it) => ({
      product: it.product._id,
      qty: it.qty,
      price: it.product.price, // snapshot
    }));
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      status: 'paid',
      paidAt: new Date(),
    });

    cart.items = [];
    await cart.save();

    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Finalize failed' });
  }
});

module.exports = router;
