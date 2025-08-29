
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    name: 'Classic Black Tee',
    price: 19.99,
    sizes: ['S','M','L','XL'],
    colors: ['black'],
    imageUrl: 'https://placehold.co/600x600?text=Black+Tee',
    description: 'Soft cotton, unisex fit.',
  },
  {
    name: 'White Logo Tee',
    price: 21.99,
    sizes: ['S','M','L','XL','XXL'],
    colors: ['white'],
    imageUrl: 'https://placehold.co/600x600?text=White+Logo+Tee',
    description: 'Minimal front logo.',
  },
  {
    name: 'Graphite Oversized Tee',
    price: 24.99,
    sizes: ['M','L','XL','XXL'],
    colors: ['gray'],
    imageUrl: 'https://placehold.co/600x600?text=Graphite+Oversized',
    description: 'Relaxed street fit.',
  },
  {
    name: 'Color Pop Tee',
    price: 22.50,
    sizes: ['XS','S','M','L'],
    colors: ['blue','red'],
    imageUrl: 'https://placehold.co/600x600?text=Color+Pop',
    description: 'Vibrant colors, soft hand feel.',
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ Seeded 4 T-shirts');
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  }
})();
