'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '@/components/auth-modal';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, fallback, requireAuth = true }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show auth modal when user is not authenticated and auth is required
  useEffect(() => {
    if (!loading && !user && requireAuth) {
      setShowAuthModal(true);
    } else if (user) {
      setShowAuthModal(false);
    }
  }, [user, loading, requireAuth]);

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, show auth modal
  if (!user && requireAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        {fallback || (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to access this page. Your authentication modal should appear automatically.
              </p>
            </CardContent>
          </Card>
        )}
        
        <AuthModal 
          open={showAuthModal} 
          onOpenChange={(open) => {
            setShowAuthModal(open);
            // Don't allow closing the modal on auth-required pages
            if (!open && requireAuth && !user) {
              setTimeout(() => setShowAuthModal(true), 500);
            }
          }}
          defaultTab="signin"
        />
      </div>
    );
  }

  // If user is authenticated or auth is not required, show children
  return <>{children}</>;
}