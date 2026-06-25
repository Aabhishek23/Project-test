import mongoose from 'mongoose';
import config from './index.js';

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`==========================================`);
    console.log(`  MongoDB Connected: ${conn.connection.host}`);
    console.log(`==========================================`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
