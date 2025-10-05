'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, CheckCircle2, ArrowLeft, Mail, Sparkles } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  
  const [validation, setValidation] = useState({
    email: { isValid: false, message: '' },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return { isValid: false, message: 'Email is required' };
    if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' };
    return { isValid: true, message: '' };
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    const emailValidation = validateEmail(value);
    setValidation({ email: emailValidation });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.email.isValid) return;

    setIsLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later');
      } else {
        setError(error.message || 'Failed to send password reset email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50 p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <Card className="w-full max-w-md relative z-10 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                ComponentVault
              </span>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-900">Check your email</CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a password reset link to<br />
              <span className="font-medium text-gray-900">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Password reset email sent successfully! Check your inbox and spam folder.
              </AlertDescription>
            </Alert>

            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>Didn't receive the email? Check your spam folder or</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                  setValidation({ email: { isValid: false, message: '' } });
                }}
                className="text-violet-600 hover:text-violet-700 p-0 h-auto font-medium"
              >
                try a different email address
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              asChild
              variant="outline"
              className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Link href="/auth/sign-in">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to sign in
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-blue-50 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              ComponentVault
            </span>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-violet-600" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900">Forgot your password?</CardTitle>
          <CardDescription className="text-gray-600">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`h-11 ${validation.email.message && !validation.email.isValid ? 'border-red-500' : validation.email.isValid ? 'border-green-500' : ''}`}
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
              {validation.email.message && (
                <p className="text-xs text-red-600">
                  {validation.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium transition-all duration-200"
              disabled={isLoading || !validation.email.isValid}
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            asChild
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-700"
            disabled={isLoading}
          >
            <Link href="/auth/sign-in">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/sign-up" className="text-violet-600 hover:underline font-medium">
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}