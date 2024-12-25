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
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/utils/supabase/client";
import { UserIcon, LogOutIcon, ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserNavProps {
    email: string;
    avatarUrl?: string;
    name?: string;
}

export default function UserNav({ email, avatarUrl, name }: UserNavProps) {
    const supabase = createClient();
    const router = useRouter();
    const { clearUserStore } = useUserStore();

    const signOut = async () => {
        clearUserStore();
        await supabase.auth.signOut();
        router.push("/");
    };

    const emailInitials = email ? email.substring(0, 2).toUpperCase() : "";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative w-fit md:w-full max-w-xs rounded-full p-4 border shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
                >
                    {avatarUrl ? (
                        <Avatar className="h-8 w-8 md:h-9 md:w-9">
                            <AvatarImage src={avatarUrl} alt={name} />
                            <AvatarFallback>
                                {name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            {email && email.length >= 2 ? (
                                <Avatar className="h-8 w-8 md:h-9 md:w-9">
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
                        <p className="text-sm font-medium leading-none">
                            {name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {email}
                        </p>
                    </div>
                    <ChevronDownIcon className="ml-1 h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Open user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    onClick={signOut}
                >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
