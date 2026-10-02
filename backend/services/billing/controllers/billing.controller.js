import { PLANS } from "../config/Plans.js";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";

export const createOrder = async (req, res) => {
  try {
    const { plan } = res.body;
    const userId = req.headers["x-user-id"];
    const selectedplan = PLANS[plan];

    if (!selectedplan) {
      return res.status(404).json({ message: "plan not found" });
    }
    const order = await razorpay.orders.create({
      amount: selectedplan.amount * 100,
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
    });
    await Payment.create({
      userId,
      orderId: order.id,
      amount: selectedplan.amount,
      credits: selectedplan.credits,
      plan: selectedplan.id,
      currency: "INR",
      status: "created",
    });
    return res.status(200).json({ order, plan: selectedplan });
  } catch (error) {
    return res.status(500).json({ message: `create order error ${error}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const generateSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
  } catch (error) {}
};
