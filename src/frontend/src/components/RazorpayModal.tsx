import { CreditCard, Lock, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { PricingPlan } from "../context/CMSContext";

interface RazorpayModalProps {
  plan: PricingPlan;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

type PaymentTab = "upi" | "card" | "netbanking";
type FlowState = "idle" | "processing" | "success";

const BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Yes Bank",
  "IndusInd Bank",
];

function generateOrderId() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "order_FH_";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function RazorpayModal({
  plan,
  onClose,
  onSuccess,
}: RazorpayModalProps) {
  const [tab, setTab] = useState<PaymentTab>("upi");
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [orderId, setOrderId] = useState("");

  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const amount = plan.price === "Free" ? "\u20b90" : plan.price;

  function handlePay() {
    setFlowState("processing");
    setTimeout(() => {
      const id = generateOrderId();
      setOrderId(id);
      setFlowState("success");
    }, 2000);
  }

  function handleContinue() {
    onSuccess(orderId);
  }

  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  return (
    <div
      data-ocid="razorpay.modal"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={flowState === "idle" ? onClose : undefined}
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl z-10"
        style={{ background: "#1a1a2e" }}
      >
        {/* Razorpay-style blue header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: "#3395FF" }}
        >
          <div>
            <p className="text-white text-xs font-medium opacity-80">
              Food Haveli
            </p>
            <p className="text-white text-lg font-bold">
              {amount}
              <span className="text-sm font-normal opacity-80">/month</span>
            </p>
            <p className="text-white/70 text-xs">{plan.name} Plan</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-lg px-3 py-1.5">
              <p className="text-white text-xs font-semibold">🔥 Food Haveli</p>
            </div>
            <button
              type="button"
              data-ocid="razorpay.close_button"
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="relative">
          {/* Processing overlay */}
          <AnimatePresence>
            {flowState === "processing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                data-ocid="razorpay.loading_state"
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1a1a2e]/95 rounded-b-2xl"
              >
                <div className="w-14 h-14 rounded-full border-4 border-[#3395FF]/30 border-t-[#3395FF] animate-spin mb-4" />
                <p className="text-white font-semibold">
                  Processing your payment securely...
                </p>
                <p className="text-white/50 text-xs mt-1">
                  Please do not close this window
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success state */}
          <AnimatePresence>
            {flowState === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                data-ocid="razorpay.success_state"
                className="px-6 py-10 flex flex-col items-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4"
                >
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-label="Payment successful checkmark"
                  >
                    <title>Payment successful</title>
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <p className="text-2xl font-bold text-white mb-1">
                  Payment Successful!
                </p>
                <p className="text-white/50 text-xs mb-3 font-mono bg-white/5 px-3 py-1 rounded-full">
                  {orderId}
                </p>
                <p className="text-white/80 text-sm mb-6">
                  Your{" "}
                  <span className="text-[#3395FF] font-semibold">
                    {plan.name}
                  </span>{" "}
                  plan is now active!
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    data-ocid="razorpay.secondary_button"
                    onClick={() =>
                      alert(
                        `Receipt for ${orderId} \u2014 ${plan.name} Plan \u2014 ${amount}/month`,
                      )
                    }
                    className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm hover:border-white/40 hover:text-white transition-all"
                  >
                    Download Receipt
                  </button>
                  <button
                    type="button"
                    data-ocid="razorpay.confirm_button"
                    onClick={handleContinue}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                    style={{ background: "#3395FF" }}
                  >
                    Continue to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment form (idle) */}
          {flowState === "idle" && (
            <div className="px-6 pt-5 pb-6">
              {/* Tab switcher */}
              <div className="flex rounded-lg overflow-hidden border border-white/10 mb-5">
                {(["upi", "card", "netbanking"] as PaymentTab[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    data-ocid={`razorpay.${t}_tab` as string}
                    onClick={() => setTab(t)}
                    className="flex-1 py-2 text-xs font-semibold transition-all"
                    style={{
                      background: tab === t ? "#3395FF" : "transparent",
                      color: tab === t ? "white" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {t === "upi"
                      ? "UPI"
                      : t === "card"
                        ? "Cards"
                        : "Net Banking"}
                  </button>
                ))}
              </div>

              {/* UPI Tab */}
              {tab === "upi" && (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="upi-input"
                      className="block text-white/70 text-xs font-medium mb-1"
                    >
                      Enter UPI ID
                    </label>
                    <input
                      id="upi-input"
                      type="text"
                      data-ocid="razorpay.input"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#3395FF]/60 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      import("sonner").then(({ toast }) =>
                        toast.success("UPI ID verified!"),
                      )
                    }
                    className="w-full py-2.5 rounded-xl border border-[#3395FF]/50 text-[#3395FF] text-sm font-semibold hover:bg-[#3395FF]/10 transition-all"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    data-ocid="razorpay.submit_button"
                    onClick={handlePay}
                    className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                    style={{ background: "#3395FF" }}
                  >
                    Pay {amount}
                  </button>
                </div>
              )}

              {/* Cards Tab */}
              {tab === "card" && (
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="card-number"
                      className="block text-white/70 text-xs font-medium mb-1"
                    >
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        id="card-number"
                        type="text"
                        data-ocid="razorpay.input"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#3395FF]/60 transition-colors pr-10"
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="card-expiry"
                        className="block text-white/70 text-xs font-medium mb-1"
                      >
                        Expiry (MM/YY)
                      </label>
                      <input
                        id="card-expiry"
                        type="text"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(formatExpiry(e.target.value))
                        }
                        placeholder="MM/YY"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#3395FF]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="card-cvv"
                        className="block text-white/70 text-xs font-medium mb-1"
                      >
                        CVV
                      </label>
                      <input
                        id="card-cvv"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                        placeholder="\u2022\u2022\u2022"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#3395FF]/60 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="card-name"
                      className="block text-white/70 text-xs font-medium mb-1"
                    >
                      Name on Card
                    </label>
                    <input
                      id="card-name"
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Abhay Vishwakarma"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#3395FF]/60 transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    data-ocid="razorpay.submit_button"
                    onClick={handlePay}
                    className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                    style={{ background: "#3395FF" }}
                  >
                    Pay {amount}
                  </button>
                </div>
              )}

              {/* Net Banking Tab */}
              {tab === "netbanking" && (
                <div className="space-y-3">
                  <label
                    htmlFor="bank-select"
                    className="block text-white/70 text-xs font-medium mb-1"
                  >
                    Select Your Bank
                  </label>
                  <select
                    id="bank-select"
                    data-ocid="razorpay.select"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#3395FF]/60 transition-colors appearance-none"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="" style={{ background: "#1a1a2e" }}>
                      -- Select Bank --
                    </option>
                    {BANKS.map((b) => (
                      <option
                        key={b}
                        value={b}
                        style={{ background: "#1a1a2e" }}
                      >
                        {b}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    data-ocid="razorpay.submit_button"
                    onClick={handlePay}
                    className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                    style={{ background: "#3395FF" }}
                  >
                    Proceed to Bank
                  </button>
                </div>
              )}

              {/* Secured by Razorpay */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-white/30">
                <Lock className="w-3 h-3" />
                <span className="text-xs">Secured by</span>
                <span className="text-xs font-bold text-[#3395FF]/70">
                  Razorpay
                </span>
                <Shield className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
