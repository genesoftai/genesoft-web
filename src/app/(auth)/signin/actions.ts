"use server";

import { createClient } from "@/utils/supabase/server";

export async function signInWithEmail({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const payload = {
        email,
        password,
    };

    const { error, data } = await supabase.auth.signInWithPassword(payload);

    if (error) {
        throw new Error("Invalid email or password");
    }

    return data;
}

export async function resetPassword(email: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/account/reset-password`,
    });

    if (error) {
        throw new Error("Failed to reset password");
    }
}

export async function updateUserPassword(password: string, code: string) {
    const supabase = await createClient();

    const res = await supabase.auth.exchangeCodeForSession(code);
    const session = res.data.session;

    if (session) {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            throw new Error("Failed to reset password");
        }
    }
}

export async function continueWithGoogle() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            queryParams: {
                access_type: "offline",
                prompt: "consent",
            },
        },
    });

    if (error) {
        throw new Error("Failed to Sign In with Google");
    }

    return data;
}
