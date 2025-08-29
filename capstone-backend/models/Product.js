const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required:true, trim: true},
    price: {type: Number, required: true, min: 0},
    sizes: [{ type: String, enum: ['XS','S','M','L','XL','XXL']}],
    colors: [{ type: String}],
    imageUrl:   { type: String, required: true },
    description:{ type: String, default: '' },
    category: { type: String, default: 'T-Shirts', index: true },
    inStock: { type: Boolean, default: true }
},
 {timestamps: true});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;