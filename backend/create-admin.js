const dns = require('dns');
dns.setServers(['8.8.8.8']);
/*
 * BloodLink - Create Admin User Script
 * Run this once to create an admin account:
 *   node create-admin.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['DONOR', 'HOSPITAL', 'ADMIN'], default: 'DONOR' }
});
const User = mongoose.model('User', UserSchema);

const ADMIN_USERNAME = 'admin_thane';
const ADMIN_PASSWORD = 'BloodLink@2024Thane';
const ADMIN_EMAIL = 'admin@bloodlink.org';
const ADMIN_PHONE = '0000000000';

async function createAdmin() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const existing = await User.findOne({ username: ADMIN_USERNAME });
        if (existing) {
            console.log(`Found existing user: ${existing.username} (${existing.role})`);
            if (existing.role !== 'ADMIN') {
                existing.role = 'ADMIN';
                await existing.save();
                console.log(`Updated existing user "${ADMIN_USERNAME}" to ADMIN role.`);
            } else {
                console.log(`Admin user "${ADMIN_USERNAME}" already exists.`);
            }
        } else {
            console.log('User not found, creating new admin...');
            await User.create({
                username: ADMIN_USERNAME,
                password: ADMIN_PASSWORD,
                email: ADMIN_EMAIL,
                phone: ADMIN_PHONE,
                role: 'ADMIN'
            });
            console.log('------------------------------------------------');
            console.log('✅ Admin user created successfully!');
            console.log(`   Username : ${ADMIN_USERNAME}`);
            console.log(`   Password : ${ADMIN_PASSWORD}`);
            console.log('------------------------------------------------');
        }
    } catch (err) {
        console.error('Error creating admin:', err.message);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
        }
    }
}

createAdmin();
