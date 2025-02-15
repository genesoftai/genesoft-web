import Signup from "@/components/auth/Signup";
import posthog from "posthog-js";

export default function SignupPage() {
    posthog.capture("pageview_signup");
    return (
        <div>
            <Signup />
        </div>
    );
}
