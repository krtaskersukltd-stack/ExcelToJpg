import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    if (publishableKey && !publishableKey.startsWith("pk_test_placeholder")) {
      stripePromise = loadStripe(publishableKey);
    } else {
      stripePromise = Promise.resolve(null);
    }
  }
  return stripePromise;
};

export interface CreateCheckoutSessionPayload {
  planId: string;
  planName: string;
  amount: number;
  currency?: string;
  isYearly: boolean;
  email: string;
  name?: string;
}

export interface CheckoutSessionResponse {
  success: boolean;
  sessionId?: string;
  url?: string;
  isDemoMode?: boolean;
  error?: string;
}

export async function createCheckoutSession(
  payload: CreateCheckoutSessionPayload
): Promise<CheckoutSessionResponse> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to initiate Stripe checkout session.",
    };
  }
}
