// routes/checkout.js
const router = require('express').Router();
const Stripe = require('stripe');
const { protect } = require('../middleware/auth');
const Cart = require('../models/Cart');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /checkout  -> create a Stripe Checkout Session from the user's cart
router.post('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const line_items = cart.items.map((it) => {
      const unit_amount = Math.round(Number(it.product.price) * 100);
      if (!Number.isFinite(unit_amount) || unit_amount <= 0) {
        throw new Error(`Invalid price for product "${it.product.name}"`);
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: it.product.name,
            images: it.product.imageUrl ? [it.product.imageUrl] : [],
          },
          unit_amount, // cents
        },
        quantity: it.qty,
        adjustable_quantity: { enabled: true, minimum: 1 },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${process.env.CLIENT_URL}/orders?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart?canceled=1`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res
      .status(500)
      .json({ message: 'Failed to create checkout session', detail: err.message, type: err.type, code: err.code });
  }
});

module.exports = router;
