'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import GenesoftLogo from '@/components/common/GenesoftLogo';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import UserNav from './UserNav';
import { UserStore, useUserStore } from '@/stores/user-store';
import { User } from '@supabase/supabase-js';

type UserData = { user: User } | { user: null };

export default function Navbar() {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState<UserData>();
  const { updateUser } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    setupUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        window.localStorage.removeItem('session');
        setUserEmail('');
      } else if (session) {
        window.localStorage.setItem('session', JSON.stringify(session));
        setUserEmail(session.user.email ?? '');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setupUserData = async () => {
    const { data } = await supabase.auth.getUser();
    if (!userEmail) {
      const user = data?.user;
      updateUser(user as Partial<UserStore>);
      setUserEmail(user?.email ?? '');
    }
    setUserData(data);
  };

  return (
    <nav className="border-b border-[1px] border-primary/10 shadow w-full sticky top-0 bg-white z-50">
      <div className="w-full flex items-center justify-between py-4 px-10 md:px-20 lg:px-40">
        <Link href="/" className="flex items-center">
          <GenesoftLogo />
        </Link>
        <div className="hidden md:flex space-x-48">
          <div className="flex items-center space-x-4 md:space-x-10 text-muted-foreground">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/ai-assistant"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="mailto:support@genesoftai.com"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Support
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {userEmail ? (
            <UserNav
              email={userEmail}
              avatarUrl={userData?.user?.user_metadata?.avatar_url}
              name={userData?.user?.user_metadata?.name}
            />
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => {
                  router.push('/login');
                }}
                className="text-sm font-medium transition-colors bg-white text-genesoft hover:bg-genesoft/10 cursor-pointer"
              >
                Sign in
              </Button>

              <Button
                onClick={() => {
                  router.push('/signup');
                }}
                className="text-sm font-medium transition-colors bg-genesoft hover:bg-genesoft/90 cursor-pointer"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-white">
            <nav className="flex flex-col space-y-4">
              <div className="flex flex-col items-start space-y-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/ai-assistant"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="mailto:support@genesoftai.com"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Support
                </Link>
              </div>

              {userEmail ? (
                <UserNav
                  email={userEmail}
                  avatarUrl={userData?.user?.user_metadata?.avatar_url}
                  name={userData?.user?.user_metadata?.name}
                />
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => {
                      router.push('/login');
                    }}
                    className="text-sm font-medium transition-colors bg-white text-genesoft hover:bg-genesoft/10 cursor-pointer"
                  >
                    Sign in
                  </Button>

                  <Button
                    onClick={() => {
                      router.push('/signup');
                    }}
                    className="text-sm font-medium transition-colors bg-genesoft hover:bg-genesoft/90 cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
