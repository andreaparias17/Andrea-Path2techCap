const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 } 
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }, // snapshot at purchase time
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'paid' },
  paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
