require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.js');

const dbUrl = process.env.DB_URL;


async function run() {
    try {
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoBD');

        const email = 'admin@example.com';
        const password = 'AdminPass123!';
        const name = 'Admin';

        let admin = await User.findOne({email});
        if(admin){
            console.log('Admin already exists:', admin.email);
        }else {
            admin = await User.create({name, email, password, role: 'admin'});
            console.log('Admin created', admin.email);
        }
        mongoose.disconnect();
    } catch (err) {
        console.error('Error creating admin', err);
        mongoose.disconnect();
    }
}

run();