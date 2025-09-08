require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    const email  = process.argv[2] || 'admin@example.com';
    const newPwd = process.argv[3] || 'Admin123';

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) throw new Error(`User not found: ${email}`);

    // set plain text — pre('save') will hash it
    user.password = newPwd;
    await user.save();

    console.log(`✅ Password reset for ${email}`);
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
