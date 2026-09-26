const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in server/.env');
    return;
  }
  try {
    const conn = await mongoose.connect(uri);
    const isAtlas = conn.connection.host.includes('mongodb.net') || conn.connection.host.includes('cluster');
    console.log(`✅ MongoDB Connected to ${isAtlas ? 'MongoDB Atlas' : 'Host'}: ${conn.connection.host} [DB: ${conn.connection.name}]`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;

