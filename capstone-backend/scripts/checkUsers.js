// scripts/checkUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.DB_URL;
    if (!uri) throw new Error('Missing MONGO_URI or DB_URL in .env');
    await mongoose.connect(uri);

    console.log('✅ Connected to:', mongoose.connection.host, 'DB:', mongoose.connection.name);

    const users = await User.find({}, { email: 1, role: 1, _id: 0 }).lean();
    console.log('Users found:', users.length);
    users.forEach(u => console.log('-', u.email, `(${u.role})`));

    process.exit(0);
  } catch (e) {
    console.error('❌', e);
    process.exit(1);
  }
})();
