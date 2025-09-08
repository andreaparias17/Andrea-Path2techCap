require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3500;
const dbUrl = process.env.DB_URL;
const Product = require('./models/Product');
const authRoutes = require('./routes/auth');
const { protect, adminOnly } = require('./middleware/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders'); 

// Connect to MongoDB
mongoose.connect(dbUrl)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors({ origin: ['http://localhost:5173'], credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/', orderRoutes);
app.use("/checkout", require("./routes/checkout"));
app.use('/upload', require('./routes/upload'));
app.use((req, _res, next) => { console.log(req.method, req.url); next(); });




// PUBLIC ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to the Capstone Backend API');    
});

app.get('/products', async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
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

// ADMIN ONLY ROUTES
app.post('/products', protect, adminOnly, async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', detail: error.message });
  }
});

app.delete('/products/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error ) {
    res.status(400).json({ message: 'Invalid ID' });
  }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
