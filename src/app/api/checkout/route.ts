import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, planName, amount, isYearly, email } = body;

    if (!planId || !planName || amount === undefined || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (planId, planName, amount, email)" },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    // If Stripe secret key is configured, create a real Stripe Checkout Session
    if (stripeSecretKey && !stripeSecretKey.startsWith("sk_test_placeholder") && stripeSecretKey.trim().length > 10) {
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2025-02-24.acacia" as any,
      });

      const origin = req.headers.get("origin") || req.headers.get("referer") || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Excel To JPG — ${planName}`,
                description: `${isYearly ? "Annual" : "Monthly"} membership tier with full tabular extraction features.`,
                images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80"],
              },
              unit_amount: Math.round(Number(amount) * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/pricing?status=success&session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(planName)}&email=${encodeURIComponent(email)}`,
        cancel_url: `${origin}/pricing?status=cancelled`,
        metadata: {
          planId,
          planName,
          isYearly: String(isYearly),
          customerEmail: email,
        },
      });

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        url: session.url,
      });
    }

    // Demo / Sandbox mode fallback when Stripe Key is not set
    return NextResponse.json({
      success: true,
      isDemoMode: true,
      message: "Stripe Demo Mode: Key not configured in .env.local yet.",
      planName,
      amount,
      email,
    });
  } catch (error: any) {
    console.error("[Stripe Checkout API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Stripe checkout session" },
      { status: 500 }
    );
  }
}
