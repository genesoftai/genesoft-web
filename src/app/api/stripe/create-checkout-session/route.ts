import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const prices = await stripe.prices.list({
            lookup_keys: [body.lookup_key],
            expand: ["data.product"],
        });

        console.log({ message: "Stripe product prices", prices });
        console.log({
            message: "Stripe product prices data",
            data: prices.data[0],
        });

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: "auto",
            line_items: [
                {
                    price: prices.data[0].id,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${YOUR_DOMAIN}/ai-assistant?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/ai-assistant?canceled=true`,
            customer_email: body.customer_email,
            subscription_data: {
                trial_period_days: 7,
            },
        });

        console.log({ message: "Stripe checkout session", session });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
}
