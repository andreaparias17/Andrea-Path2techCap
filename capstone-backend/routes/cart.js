const router = require('express').Router();
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');


router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get cart' });
  }
});

// POST /cart -> { productId, qty }
router.post('/', protect, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    if (!productId || qty < 1) {
      return res.status(400).json({ message: 'productId and qty>=1 required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx >= 0) cart.items[idx].qty = qty;
    else cart.items.push({ product: productId, qty });

    await cart.save();
    const populated = await cart.populate('items.product');
    return res.status(201).json(populated);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to update cart' });
  }
});

// DELETE /cart/:productId -> remove a line
router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.json({ ok: true, message: 'Cart already empty' });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    const populated = await cart.populate('items.product');
    return res.json(populated);
  } catch {
    return res.status(500).json({ message: 'Failed to remove item' });
  }
});

module.exports = router;
