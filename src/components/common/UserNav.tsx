import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/stores/user-store';
import { createClient } from '@/utils/supabase/client';
import {
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
  CalendarCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    router.push('/');
  };

  const handleSubscription = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const result = await fetch(`/api/user?email=${userData?.user?.email}`);
    const user = await result.json();

    const response = await fetch(`api/stripe/create-portal-session`, {
      method: 'POST',
      body: JSON.stringify({ customer_id: user.customer_id }),
    });
    const data = await response.json();
    router.push(data.url);
  };

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
              <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
          )}
          <div className="ml-2 flex-1 text-left">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
          <ChevronDownIcon className="ml-1 h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
            onClick={handleSubscription}
          >
            <CalendarCheck className="mr-2 h-4 w-4" />
            <span>Subscription</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
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
