"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FirebaseLogo from "@public/firebase/Firebase-logo-02.png";
import Image from "next/image";
import { FirebaseEnv } from "@/types/integration";
import { Button } from "@/components/ui/button";
import { updateEnvs } from "@/actions/integration";
import { Loader2 } from "lucide-react";

type FirebaseSectionProps = {
    projectId: string;
    firebaseEnv: FirebaseEnv;
};

export const FirebaseSection = ({
    projectId,
    firebaseEnv,
}: FirebaseSectionProps) => {
    const [apiKey, setApiKey] = useState(
        firebaseEnv?.NEXT_PUBLIC_FIREBASE_API_KEY?.value,
    );
    const [authDomain, setAuthDomain] = useState(
        firebaseEnv?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.value,
    );
    const [firebaseProjectId, setFirebaseProjectId] = useState(
        firebaseEnv?.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.value,
    );
    const [storageBucket, setStorageBucket] = useState(
        firebaseEnv?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.value,
    );
    const [messagingSenderId, setMessagingSenderId] = useState(
        firebaseEnv?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.value,
    );
    const [appId, setAppId] = useState(
        firebaseEnv?.NEXT_PUBLIC_FIREBASE_APP_ID?.value,
    );
    const [measurementId, setMeasurementId] = useState(
        firebaseEnv?.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.value,
    );

    const [loading, setLoading] = useState(false);

    const handleSaveChanges = async () => {
        setLoading(true);
        console.log({
            message: "handleSaveChanges",
            apiKey,
            authDomain,
            projectId: firebaseProjectId,
            storageBucket,
            messagingSenderId,
            appId,
            measurementId,
        });

        const payload = {
            project_id: firebaseProjectId,
            env_vars: {
                NEXT_PUBLIC_FIREBASE_API_KEY: apiKey,
                NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: authDomain,
                NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseProjectId,
                NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket,
                NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
                NEXT_PUBLIC_FIREBASE_APP_ID: appId,
                NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: measurementId,
            },
            branch: "dev",
            target: ["preview"],
            env_vars_comment: {
                NEXT_PUBLIC_FIREBASE_API_KEY: "Firebase API Key",
                NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "Firebase Auth Domain",
                NEXT_PUBLIC_FIREBASE_PROJECT_ID: "Firebase Project ID",
                NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "Firebase Storage Bucket",
                NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
                    "Firebase Messaging Sender ID",
                NEXT_PUBLIC_FIREBASE_APP_ID: "Firebase App ID",
                NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: "Firebase Measurement ID",
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
            console.error("Error updating firebase envs:", error);
            throw new Error("Failed to update firebase envs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Image
                    src={FirebaseLogo}
                    alt="Firebase Logo"
                    width={24}
                    height={24}
                />
                <h3 className="text-white text-sm font-medium">Firebase</h3>
            </div>
            <div className="text-subtext-in-dark-bg text-sm">
                Connect your Firebase project to to implement authentication,
                database, and storage services.
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="firebase-api-key"
                    className="text-white text-xs"
                >
                    API Key
                </Label>
                <Input
                    id="firebase-api-key"
                    placeholder="firebase-api-key"
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label
                    htmlFor="firebase-auth-domain"
                    className="text-white text-xs"
                >
                    Auth Domain
                </Label>
                <Input
                    id="firebase-auth-domain"
                    placeholder="nextjs-firebase-web-template.firebaseapp.com"
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={authDomain}
                    onChange={(e) => setAuthDomain(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label
                    htmlFor="firebase-project-id"
                    className="text-white text-xs"
                >
                    Project ID
                </Label>
                <Input
                    id="firebase-project-id"
                    placeholder="nextjs-firebase-web-template"
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={firebaseProjectId}
                    onChange={(e) => setFirebaseProjectId(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label
                    htmlFor="firebase-storage-bucket"
                    className="text-white text-xs"
                >
                    Storage Bucket
                </Label>
                <Input
                    id="firebase-storage-bucket"
                    placeholder="nextjs-firebase-web-template.firebasestorage.app"
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={storageBucket}
                    onChange={(e) => setStorageBucket(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label
                    htmlFor="firebase-messaging-sender-id"
                    className="text-white text-xs"
                >
                    Messaging Sender ID
                </Label>
                <Input
                    id="firebase-messaging-sender-id"
                    placeholder="firebase-messaging-sender-id"
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={messagingSenderId}
                    onChange={(e) => setMessagingSenderId(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="firebase-app-id" className="text-white text-xs">
                    App ID
                </Label>
                <Input
                    id="firebase-app-id"
                    placeholder="firebase-app-id"
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label
                    htmlFor="firebase-measurement-id"
                    className="text-white text-xs"
                >
                    Measurement ID
                </Label>
                <Input
                    id="firebase-measurement-id"
                    placeholder="firebase-measurement-id"
                    className="bg-secondary-dark border-line-in-dark-bg text-white text-sm"
                    value={measurementId}
                    onChange={(e) => setMeasurementId(e.target.value)}
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

export default FirebaseSection;
