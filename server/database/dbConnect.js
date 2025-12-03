import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "TEST_MERN_STACK_CHAT_APP",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ Connected to Database");
  } catch (err) {
    console.error("❌ Error Connecting to Database:", err);
    process.exit(1); // stop server if DB connection fails
  }
};
