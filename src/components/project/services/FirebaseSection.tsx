"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FirebaseLogo from "@public/firebase/Firebase-logo-02.png";
import Image from "next/image";

export const FirebaseSection = () => {
    const [apiKey, setApiKey] = useState("");
    const [authDomain, setAuthDomain] = useState("");
    const [projectId, setProjectId] = useState("");
    const [storageBucket, setStorageBucket] = useState("");
    const [messagingSenderId, setMessagingSenderId] = useState("");
    const [appId, setAppId] = useState("");
    const [measurementId, setMeasurementId] = useState("");

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
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
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
        </div>
    );
};

export default FirebaseSection;
