'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Github, Mail, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle, signInWithGithub } from '@/lib/firebase/auth';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const [validation, setValidation] = useState({
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
    confirmPassword: { isValid: false, message: '' },
    displayName: { isValid: false, message: '' },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return { isValid: false, message: 'Email is required' };
    if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' };
    return { isValid: true, message: '' };
  };

  const validatePassword = (password: string) => {
    if (!password) return { isValid: false, message: 'Password is required' };
    if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters' };
    if (!/(?=.*[a-z])/.test(password)) return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    if (!/(?=.*[A-Z])/.test(password)) return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    if (!/(?=.*\d)/.test(password)) return { isValid: false, message: 'Password must contain at least one number' };
    return { isValid: true, message: 'Strong password!' };
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return { isValid: false, message: 'Please confirm your password' };
    if (confirmPassword !== password) return { isValid: false, message: 'Passwords do not match' };
    return { isValid: true, message: 'Passwords match!' };
  };

  const validateDisplayName = (displayName: string) => {
    if (!displayName) return { isValid: false, message: 'Display name is required' };
    if (displayName.length < 2) return { isValid: false, message: 'Display name must be at least 2 characters' };
    if (displayName.length > 50) return { isValid: false, message: 'Display name must be less than 50 characters' };
    return { isValid: true, message: '' };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    let fieldValidation;
    switch (field) {
      case 'email':
        fieldValidation = validateEmail(value);
        break;
      case 'password':
        fieldValidation = validatePassword(value);
        // Re-validate confirm password if it exists
        if (formData.confirmPassword) {
          setValidation(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
          }));
        }
        break;
      case 'confirmPassword':
        fieldValidation = validateConfirmPassword(value, formData.password);
        break;
      case 'displayName':
        fieldValidation = validateDisplayName(value);
        break;
      default:
        return;
    }

    setValidation(prev => ({
      ...prev,
      [field]: fieldValidation
    }));
  };

  const isFormValid = () => {
    return Object.values(validation).every(field => field.isValid);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await signUpWithEmail(formData.email, formData.password, formData.displayName);
      setSuccess('Account created successfully! Please check your email for verification.');
      setTimeout(() => {
        router.push('/auth/sign-in');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up with Google');
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGithub();
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up with GitHub');
      setIsLoading(false);
    }
  };

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
          <CardTitle className="text-2xl font-bold text-gray-900">Create your account</CardTitle>
          <CardDescription className="text-gray-600">
            Join thousands of developers building amazing components
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              onClick={handleGithubSignUp}
              disabled={isLoading}
              className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="John Doe"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className={`h-11 ${validation.displayName.message && !validation.displayName.isValid ? 'border-red-500' : validation.displayName.isValid ? 'border-green-500' : ''}`}
                disabled={isLoading}
              />
              {validation.displayName.message && (
                <p className={`text-xs ${validation.displayName.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.displayName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`h-11 ${validation.email.message && !validation.email.isValid ? 'border-red-500' : validation.email.isValid ? 'border-green-500' : ''}`}
                disabled={isLoading}
              />
              {validation.email.message && (
                <p className={`text-xs ${validation.email.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`h-11 pr-10 ${validation.password.message && !validation.password.isValid ? 'border-red-500' : validation.password.isValid ? 'border-green-500' : ''}`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {validation.password.message && (
                <p className={`text-xs ${validation.password.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`h-11 pr-10 ${validation.confirmPassword.message && !validation.confirmPassword.isValid ? 'border-red-500' : validation.confirmPassword.isValid ? 'border-green-500' : ''}`}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {validation.confirmPassword.message && (
                <p className={`text-xs ${validation.confirmPassword.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium transition-all duration-200"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-600">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-violet-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-violet-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-violet-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}