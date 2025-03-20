export type VercelEnvInfo = {
    type: string;
    value: string;
    target: string[];
    id: string;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    lastEditedByDisplayName: string;
};

export type StripeEnv = {
    STRIPE_SECRET_KEY: VercelEnvInfo;
    STRIPE_WEBHOOK_SECRET: VercelEnvInfo;
};

export type FirebaseEnv = {
    NEXT_PUBLIC_FIREBASE_API_KEY: VercelEnvInfo;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: VercelEnvInfo;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: VercelEnvInfo;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: VercelEnvInfo;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: VercelEnvInfo;
    NEXT_PUBLIC_FIREBASE_APP_ID: VercelEnvInfo;
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: VercelEnvInfo;
};
