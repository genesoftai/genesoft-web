"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StripeLogo from "@public/stripe.jpg";
import Image from "next/image";

export const StripeSection = () => {
    const [secretKey, setSecretKey] = useState("");
    const [webhookSecret, setWebhookSecret] = useState("");

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Image
                    src={StripeLogo}
                    alt="Stripe Logo"
                    width={24}
                    height={24}
                />
                <h3 className="text-white text-sm font-medium">Stripe</h3>
            </div>
            <div className="text-subtext-in-dark-bg text-sm">
                Connect your Stripe to enable payment processing and
                subscription management.
            </div>
            <div className="space-y-2">
                <Label
                    htmlFor="stripe-secret-key"
                    className="text-white text-xs"
                >
                    Secret Key
                </Label>
                <Input
                    id="stripe-secret-key"
                    placeholder="sk_test_..."
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label
                    htmlFor="stripe-webhook-secret"
                    className="text-white text-xs"
                >
                    Webhook Secret
                </Label>
                <Input
                    id="stripe-webhook-secret"
                    placeholder="whsec_..."
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                />
            </div>
        </div>
    );
};

export default StripeSection;
