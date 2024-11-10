import mongoose from 'mongoose';




let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

async function connectToDatabase() {
  mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB');
  }).catch (error => {
    console.error('Error connecting to MongoDB:', error);
  })
};

export default connectToDatabase;
