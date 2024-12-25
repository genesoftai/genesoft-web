"use server";

import { createClient } from "@/utils/supabase/server";
export async function signup(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const userInfo = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error, data } = await supabase.auth.signUp(userInfo);

    if (error) {
        console.error(error);
        throw new Error("Something went wrong");
    }

    return data;
}
