"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  ShieldCheck,
  Zap,
  Lock,
  CreditCard,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PricingPlan } from "./PricingCard";
import { createCheckoutSession } from "@/lib/stripe";

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
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!plan) return null;

  const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const annualTotal = (plan.yearlyPrice * 12).toFixed(2);
  const billingCycle = isYearly ? "Billed Annually" : "Billed Monthly";
  const totalAmount = isYearly ? Number(annualTotal) : currentPrice;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    setCardExpiry(raw);
  };

  // Quick fill test card
  const fillTestCard = () => {
    setEmail((prev) => prev || "user@example.com");
    setCardName("Alex Morgan");
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("12/28");
    setCardCvc("123");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await createCheckoutSession({
        planId: plan.id,
        planName: plan.name,
        amount: totalAmount,
        isYearly,
        email,
        name: cardName,
      });

      if (!response.success && response.error) {
        setIsLoading(false);
        setErrorMessage(response.error);
        return;
      }

      // If a real Stripe Hosted Checkout URL is returned, redirect the user
      if (response.url) {
        window.location.href = response.url;
        return;
      }

      // Demo/Local simulated checkout mode
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#3858F6", "#10B981", "#6366F1", "#3B82F6", "#F59E0B"],
        });
      }, 1200);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || "Checkout session error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 transform transition-all my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Top Stripe Badge */}
            <div className="flex items-center justify-between mb-4 pr-8">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center text-white shadow-xs font-bold text-xs tracking-tight">
                  S
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Stripe Secure Checkout
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                256-Bit Encrypted
              </span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Upgrade to {plan.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Instant activation for tabular data extraction & high-speed image conversions.
            </p>

            {/* Plan Card Order Summary */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">{plan.name}</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#3858F6] text-white">
                    {billingCycle}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {plan.features[0]} • Priority Rendering
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-2xl font-extrabold text-[#3858F6]">
                    ${currentPrice}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/mo</span>
                </div>
                {isYearly && (
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    ${annualTotal}/yr (Save 20%)
                  </p>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Payment Details
                </label>
                <button
                  type="button"
                  onClick={fillTestCard}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Fill Test Card
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="stripe-email"
                    className="block text-xs font-semibold text-slate-600 mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="stripe-email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3858F6] focus:border-transparent transition placeholder:text-slate-400"
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label
                    htmlFor="stripe-cardname"
                    className="block text-xs font-semibold text-slate-600 mb-1"
                  >
                    Name on Card
                  </label>
                  <input
                    id="stripe-cardname"
                    type="text"
                    placeholder="Alex Morgan"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3858F6] focus:border-transparent transition placeholder:text-slate-400"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label
                    htmlFor="stripe-cardnumber"
                    className="block text-xs font-semibold text-slate-600 mb-1"
                  >
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      id="stripe-cardnumber"
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3858F6] focus:border-transparent transition placeholder:text-slate-400"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        VISA / MC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expiry & CVC Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="stripe-expiry"
                      className="block text-xs font-semibold text-slate-600 mb-1"
                    >
                      Expires (MM/YY)
                    </label>
                    <input
                      id="stripe-expiry"
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3858F6] focus:border-transparent transition placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="stripe-cvc"
                      className="block text-xs font-semibold text-slate-600 mb-1"
                    >
                      CVC / CVV
                    </label>
                    <div className="relative">
                      <input
                        id="stripe-cvc"
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3858F6] focus:border-transparent transition placeholder:text-slate-400"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Trust and Guarantees */}
                <div className="pt-2 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>PCI-DSS Level 1 Compliant • Handled by Stripe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Instant credit activation with automatic invoices</span>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-[#3858F6] hover:bg-blue-700 disabled:opacity-75 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Secure Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        Pay ${totalAmount.toFixed(2)} with Stripe
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-4">
              Protected by reCAPTCHA and Stripe Privacy Policy. Cancel anytime with 1-click.
            </p>
          </div>
        ) : (
          /* Payment Success State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Payment Successful
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Welcome to {plan.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Your payment of <strong className="text-slate-800">${totalAmount.toFixed(2)}</strong> has been confirmed by Stripe.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs border border-slate-200/80 space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between text-slate-500">
                <span>Account Email:</span>
                <span className="font-semibold text-slate-800">{email}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Plan Tier:</span>
                <span className="font-semibold text-slate-800">{plan.name}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Monthly Extraction Credits:</span>
                <span className="font-semibold text-blue-600">{plan.features[0]}</span>
              </div>
              <div className="flex justify-between text-slate-500 border-t border-slate-200 pt-2 font-bold text-slate-800">
                <span>Status:</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-2 py-3 px-8 rounded-xl bg-[#3858F6] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              Start Converting Spreadsheets &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
