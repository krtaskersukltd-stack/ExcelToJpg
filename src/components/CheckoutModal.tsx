"use client";

import React, { useState } from "react";
import { X, Check, ShieldCheck, Zap } from "lucide-react";
import { PricingPlan } from "./PricingCard";

interface CheckoutModalProps {
  plan: PricingPlan | null;
  isYearly: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  isYearly,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!plan) return null;

  const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const billingCycle = isYearly ? "Billed Annually" : "Billed Monthly";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold text-[#3B5AF6] bg-blue-50 rounded-full border border-blue-100/80">
                Selected Tier
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {billingCycle}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Get Started with {plan.name}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Complete your registration to activate tabular data extraction.
            </p>

            {/* Plan Card Mini Summary */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{plan.name}</p>
                <p className="text-xs text-slate-500">
                  {plan.features[0]} included
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#3858F6]">
                  ${currentPrice}
                </span>
                <span className="text-xs text-slate-500 ml-1">/mo</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Work Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3858F6] focus:border-transparent transition placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-bit SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Instant access to extraction features</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-6 rounded-full bg-[#3858F6] hover:bg-[#2A48E8] text-white font-semibold text-sm shadow-[0_10px_22px_-4px_rgba(56,88,246,0.45)] transition active:scale-[0.98]"
              >
                Continue to Checkout &rarr;
              </button>
            </form>

            <p className="text-[11px] text-slate-400 text-center mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Welcome aboard!
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
              We have sent an activation link to{" "}
              <span className="font-semibold text-slate-800">{email}</span>. You
              can now start extracting tabular data with <strong>{plan.name}</strong>.
            </p>
            <button
              onClick={onClose}
              className="mt-6 py-2.5 px-8 rounded-full bg-[#3858F6] hover:bg-[#2A48E8] text-white font-semibold text-sm transition"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
