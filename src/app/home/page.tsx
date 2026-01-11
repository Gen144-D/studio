
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useEffect } from 'react';

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Logo className="size-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">Welcome to DavaoCycle!</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Hello, {user.displayName || user.email}!
        </p>
        <p className="max-w-md mx-auto mb-8">
          This is your personal dashboard. Soon you'll be able to see available bikes, manage your rentals, and view your ride history right here.
        </p>
        <Button onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
