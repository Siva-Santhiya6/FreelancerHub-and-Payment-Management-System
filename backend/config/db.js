const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const User = require('../models/User');

// Disable buffering so operations don't freeze for 10-20 seconds when offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/freelancerhub';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      family: 4, // Force IPv4 to prevent IPv6 connection closed issues
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Auto seed if database is empty
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Empty database detected. Auto-seeding demo roles and projects...');
        const seed = require('../seed/seed');
        await seed(false);
      }
    } catch (seedCheckErr) {
      console.warn('Auto-seed check note:', seedCheckErr.message);
    }
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Issue: ${error.message}`);
    console.log(`💡 Note: If using MongoDB Atlas, make sure your IP is whitelisted (0.0.0.0/0) in Atlas Network Access.`);
  }
};

module.exports = connectDB;
