import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateProjectStore } from "@/stores/create-project-store";
import { useGenesoftUserStore } from "@/stores/genesoft-user-store";
import { useGenesoftOrganizationStore } from "@/stores/organization-store";
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/utils/supabase/client";
import { UserIcon, LogOutIcon, ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

interface UserNavProps {
    email: string;
    avatarUrl?: string;
    name?: string;
}

export default function UserNav({ email, avatarUrl, name }: UserNavProps) {
    const supabase = createClient();
    const router = useRouter();
    const { clearUserStore } = useUserStore();
    const { clearGenesoftUserStore } = useGenesoftUserStore();
    const { clearGenesoftOrganizationStore } = useGenesoftOrganizationStore();
    const { clearCreateProjectStore } = useCreateProjectStore();

    const signOut = async () => {
        posthog.capture("click_signout_from_user_nav");
        clearUserStore();
        clearGenesoftUserStore();
        clearGenesoftOrganizationStore();
        clearCreateProjectStore();
        await supabase.auth.signOut();
        router.push("/");
    };

    const emailInitials = email ? email.substring(0, 2).toUpperCase() : "";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative w-fit md:w-full max-w-xs rounded-full p-4 border border-line-in-dark-bg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out hover:bg-tertiary-dark/70"
                >
                    {avatarUrl ? (
                        <Avatar className="h-4 w-4 md:h-7 md:w-7">
                            <AvatarImage src={avatarUrl} alt={name} />
                            <AvatarFallback>
                                {name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            {email && email.length >= 2 ? (
                                <Avatar className="h-4 w-4 md:h-5 md:w-5">
                                    <AvatarFallback>
                                        {emailInitials}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            )}
                        </div>
                    )}
                    <div className="ml-2 flex-1 text-left">
                        <p className="text-sm font-medium leading-none text-white">
                            {name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate text-white">
                            {email}
                        </p>
                    </div>
                    <ChevronDownIcon className="ml-1 h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Open user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 bg-primary-dark border-line-in-dark-bg"
                align="end"
                forceMount
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                            {name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground text-white">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-line-in-dark-bg" />
                <DropdownMenuItem
                    className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    onClick={signOut}
                >
                    <LogOutIcon className="mr-2 h-4 w-4 text-white" />
                    <span className="text-white">Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
