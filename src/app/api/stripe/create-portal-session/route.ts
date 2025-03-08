// app/api/create-portal-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const YOUR_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(request: Request) {
    const body = await request.json();
    const { customer_id } = body;
    console.log({ message: "Stripe customer id", customer_id });
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customer_id,
            return_url: `${YOUR_DOMAIN}/dashboard`,
        });

        console.log({ message: "Stripe portal session", portalSession });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 },
        );
    }
}
