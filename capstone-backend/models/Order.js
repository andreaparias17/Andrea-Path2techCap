const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 } 
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status:{ type: String, enum: ['pending', 'paid'], default: 'paid' },
    paidAt:{ type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
