import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import router from "./routes/billing.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(morgan("dev"));
app.use('/',router)
app.get("/",(req,res)=>{
    res.send("hello from billing service")
})

app.listen(PORT, () => {
    console.log(`billing service is running on port ${PORT}`);
    connectDB()
});
