"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import StripeLogo from "@public/stripe.jpg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { updateEnvs } from "@/actions/integration";
import { StripeEnv } from "@/types/integration";
import { Loader2 } from "lucide-react";

type StripeSectionProps = {
    projectId: string;
    stripeEnv: StripeEnv;
};

export const StripeSection = ({ projectId, stripeEnv }: StripeSectionProps) => {
    const [secretKey, setSecretKey] = useState(
        stripeEnv?.STRIPE_SECRET_KEY?.value,
    );
    const [webhookSecret, setWebhookSecret] = useState(
        stripeEnv?.STRIPE_WEBHOOK_SECRET?.value,
    );

    const [loading, setLoading] = useState(false);

    const handleSaveChanges = async () => {
        setLoading(true);
        console.log({
            message: "handleSaveChanges",
            secretKey,
            webhookSecret,
        });

        const payload = {
            project_id: projectId,
            env_vars: {
                STRIPE_SECRET_KEY: secretKey,
                STRIPE_WEBHOOK_SECRET: webhookSecret,
            },
            branch: "dev",
            target: ["preview"],
            env_vars_comment: {
                STRIPE_SECRET_KEY: "Stripe Secret Key",
                STRIPE_WEBHOOK_SECRET: "Stripe Webhook Secret",
            },
        };
        try {
            const response = await updateEnvs({
                ...payload,
                project_id: projectId,
            });
            console.log({
                message: "handleSaveChanges",
                response,
            });
        } catch (error) {
            console.error("Error updating stripe envs:", error);
            throw new Error("Failed to update stripe envs");
        } finally {
            setLoading(false);
        }
    };

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

            <Button
                className="bg-genesoft hover:bg-genesoft/90 text-white text-sm"
                onClick={handleSaveChanges}
                disabled={loading}
            >
                {loading ? "Saving..." : "Save Changes"}
                {loading && (
                    <Loader2 className="w-4 h-4 ml-2 text-white animate-spin" />
                )}
            </Button>
        </div>
    );
};

export default StripeSection;
