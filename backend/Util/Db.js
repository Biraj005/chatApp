import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv();
const DB_URL = process.env.DB_URL;

export const connectDb = async () => {
  try {
    await mongoose.connect(`${DB_URL}/chatapp`); 
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
};
