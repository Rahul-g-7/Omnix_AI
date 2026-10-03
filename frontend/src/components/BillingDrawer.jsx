import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, X } from "lucide-react";
import { useSelector } from "react-redux";
const BillingDrawer = ({ open, onclose }) => {
    const {userData}=useSelector(state=>state.user)
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
                        <p>
                            Current Plan
                        </p>
                        <h3 className=" capitalize">
                            {userData?.plan}
                        </h3>
                    </div>
                    <Crown/>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BillingDrawer;
