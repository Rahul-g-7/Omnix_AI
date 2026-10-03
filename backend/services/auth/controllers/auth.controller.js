import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";
export const login = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await getAuth(app).verifyIdToken(token);
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
      });
    }

    const sessionID = crypto.randomUUID();
    await redis.set(
      `session:${sessionID}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan || "free",
        credits: user.credits ?? 100,
        totalCredits: user.totalCredits ?? 100,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );
    res.cookie("session", sessionID, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `login error ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionID = req.cookies?.session;
    if (!sessionID) {
      return res.status(400).json({ message: "no session id" });
    }
    await redis.del(`session:${sessionID}`);
    res.clearCookie("session");
    return res.status(200).json({ message: "logout successful" });
  } catch (error) {
    console.log("logout error ", error);
    return res.status(500).json({ message: "logout error" });
  }
};

export const updateUserPayment = async (req, res) => {
  try {
    const { plan, credits, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.plan = plan;
    user.credits += credits;
    user.totalCredits += credits;
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 1000);
    await user.save();
    const sessionId = req.cookies?.session;
    await redis.set(
      `session -${sessionId}`,
      JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
        credits: user.credits,
        totalCredits: user.totalCredits,
        planExpiresAt: user.planExpiresAt,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("logout error ", error);
    return res.status(500).json({ message: `update user payment error ${error}` });
  }
};
