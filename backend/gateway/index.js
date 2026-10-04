import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import  protect  from "./middleware/auth.middleware.js";
import  getCurrentUser  from "./controllers/user.controller.js";
import { proxyWithHeader}  from "./utils/proxyWithHeader.js";
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL
}))

app.get("/", (req, res) => {
    res.json({ message: "hello from gateway service" })
})
app.use("/api/auth",proxy(process.env.AUTH_SERVICE));
app.use("/api/chat",protect,proxyWithHeader(process.env.CHAT_SERVICE));
app.use("/api/agent",protect, proxyWithHeader(process.env.AGENT_SERVICE));
app.use("/api/billing",protect,proxyWithHeader(process.env.BILLING_SERVICE));
app.get("/api/me",protect,getCurrentUser)

app.listen(PORT, () => {
    console.log(`Gateway is running on port ${PORT}`);
});
