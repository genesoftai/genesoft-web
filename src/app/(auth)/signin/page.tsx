import SignIn from "@/components/auth/SignIn";
import posthog from "posthog-js";
export default function SignInPage() {
    posthog.capture("pageview_signin");
    return (
        <div>
            <SignIn />
        </div>
    );
}
