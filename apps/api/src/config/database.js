import mongoose from "mongoose";

async function database() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(mongodbUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export default database;
