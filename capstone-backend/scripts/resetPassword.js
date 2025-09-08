// scripts/resetPassword.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.DB_URL;
    if (!uri) throw new Error('Set MONGO_URI or DB_URL in .env');
    await mongoose.connect(uri);

    const email = 'admin@example.com';   // <- the account you want to fix
    const newPass = 'Admin123';          // <- new password to set

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) throw new Error(`User not found: ${email}`);

    user.password = await bcrypt.hash(newPass, 10); // ✅ store a hash
    await user.save();

    console.log('✅ Password reset (hashed) for', email);
    process.exit(0);
  } catch (e) {
    console.error('❌', e);
    process.exit(1);
  }
})();
