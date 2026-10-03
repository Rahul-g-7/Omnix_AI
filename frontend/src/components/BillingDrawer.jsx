import React from "react";
import {
  AnimatePresence,
  AsyncMotionValueAnimation,
  motion,
} from "motion/react";
import { Crown, Currency, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";
import getCurrentUser from "../features/getCurrentUser";
import { setUserData } from "../redux/userSlice";
const BillingDrawer = ({ open, onclose }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "OmnixAI",
        description: `${data?.plan?.name} Plan`,
        order_id: data?.order?.id,
        handler: async (response) => {
          try {
            const data = await verifyPayment(response);
            console.log("data ", data);
             if (data) {
              // 🔄 Refresh the user in Redux immediately!
              const updatedUser = await getCurrentUser();
              if (updatedUser) {
                dispatch(setUserData(updatedUser));
              }
            }
          } catch (error) {
            console.log(`error ${error}`);
          }
        },
        theme: {
          color: "#4F46E5",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(`error ${error}`);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onclose}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 z-50 right-0 h-screen w-[380px] bg-[#0f1117] border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <div className="font-semibold text-white text-lg tracking-tight">
                  Billing
                </div>
                <div className="text-slate-400 text-sm ">Plans & Credits</div>
              </div>
              <button
                onClick={onclose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <X size={18} className="text-slate-300" />
              </button>
            </div>
            <div className="p-5">
              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Current Plan</p>
                    <h3 className="text-white text-xl font-bold capitalize">
                      {userData?.plan || "free"}
                    </h3>
                  </div>
                  <Crown className="text-yellow-400" />
                </div>
                <div className="mt-5 ">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Credits</span>
                    <span>
                      {userData?.credits || 0}/{userData?.totalCredits || 0}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${
                          ((userData?.credits || 0) /
                            (userData?.totalCredits || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 flex-1 overflow-auto space-y-4">
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="text-white font-semibold ">Starter Plan</h3>
                <p className="text-indigo-400 text-2xl font-bold mt-2 ">
                  {" "}
                  ₹199
                </p>
                <p className="text-slate-400 text-sm mt-1 ">500 Credits</p>
                <button
                  onClick={() => handleUpgrade("starter")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 cursor-pointer hover:bg-indigo-700 py-2 text-white"
                >
                  Upgrade
                </button>
              </div>
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="text-white font-semibold ">Pro Plan</h3>
                <p className="text-indigo-400 text-2xl font-bold mt-2 ">
                  {" "}
                  ₹499
                </p>
                <p className="text-slate-400 text-sm mt-1 ">1000 Credits</p>
                <button
                  onClick={() => handleUpgrade("pro")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 cursor-pointer hover:bg-indigo-700 py-2 text-white"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BillingDrawer;
