import express, { Router } from "express";
import "dotenv/config";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/agent.route.js";
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())
app.use("/",router)
app.use((err,req,res,next)=>{
    console.log(err);
    if(err.status){
        return res.status(err.status).json(err.data)
    }
    return res.status(500).json({message:`agent error ${err}`})
})
app.get("/",(req,res)=>{
    res.send("hello from agent service")
})

app.listen(PORT, () => {
    console.log(`agent is running on port ${PORT}`);
    connectDB()
});
