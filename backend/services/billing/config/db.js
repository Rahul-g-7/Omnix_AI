import mongoos from "mongoose";
async function connectDB() {
    try {
        await mongoos.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
export default connectDB
