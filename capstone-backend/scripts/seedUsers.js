// scripts/seedUsers.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedUsers() {
  try {
    const uri = process.env.MONGO_URI || process.env.DB_URL;
    if (!uri) {
      throw new Error(
        "No Mongo URI found. Set MONGO_URI or DB_URL in capstone-backend/.env"
      );
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    const users = [
      {
        name: "Test User",
        email: "user@example.com",
        password: "Password123",
        role: "user",
      },
      {
        name: "Admin",
        email: "admin@example.com",
        password: "Admin123",
        role: "admin",
      },
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`⚠️  ${u.email} already exists, skipping`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`✅ Created ${u.role} account: ${u.email}`);
    }

    console.log("🎉 Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
}

seedUsers();
