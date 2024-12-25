'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { updateUserPassword } from '../../login/actions';
import SimpleLoading from '@/components/common/SimpleLoading';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const code = searchParams.get('code');
    if (password === confirmPassword) {
      try {
        await updateUserPassword(password, code as string);
        setLoading(false);
        router.push('/ai-assistant');
      } catch (error) {
        setLoading(false);
        setError('Failed to reset password, Please try again.');
      }
      return;
    } else {
      setLoading(false);
      setError('Passwords do not match, Please try again.');
      return;
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Suspense>
      <div className="min-h-screen flex bg-neutral-50">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 items-center justify-evenly">
          <p className="text-6xl font-medium text-genesoft hidden lg:block">
            Genesoft
          </p>

          <section className="flex flex-col space-y-4 py-12 text-center px-4">
            <h1 className="text-2xl font-bold tracking-tight text-genesoft">
              Reset Your Password
            </h1>
            <h2 className="text-xl text-primary">
              Secure your account with a new password
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Choose a strong, unique password to protect your Genesoft account
            </p>
          </section>
        </div>

        {/* Right side - Reset Password form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-12">
            <div className="text-6xl font-medium text-genesoft lg:hidden">
              <p>Genesoft</p>
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
            <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
              Reset Your Password
            </h1>

            {error && (
              <p className="text-sm font-medium text-red-500 text-center w-full">
                {error}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    className="border-gray-300 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    className="border-gray-300 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-white bg-genesoft hover:bg-genesoft/90"
              >
                {loading ? <SimpleLoading /> : 'Reset Password'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">Remember your password? </span>
              <a href="/login" className="text-genesoft hover:underline">
                Log in
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <div>Need help?</div>
            <a
              href="mailto:support@genesoftai.com"
              className="text-primary hover:underline"
            >
              support@genesoftai.com
            </a>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
