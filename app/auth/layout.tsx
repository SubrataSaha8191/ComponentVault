import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - ComponentVault',
  description: 'Sign in to your ComponentVault account to access thousands of premium UI components.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}