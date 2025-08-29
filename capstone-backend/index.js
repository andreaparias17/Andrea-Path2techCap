require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3500;
const dbUrl = process.env.DB_URL;
const Product = require('./models/Product');

// Connect to MongoDB
mongoose.connect(dbUrl)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the Capstone Backend API');    
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

// Create a product--public for now)
app.post('/products', async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', detail: error.message });
  }
});

// ⚠️ Dev-only: delete all products
app.delete('/products', async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ ok: true, message: 'All products deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Delete a product by id public for now )
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
