
'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/config';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        setUserProfile(profile);
        // Redirect if user is not supposed to be here
        if (profile.role === 'admin') {
          router.push('/dashboard');
        }
      } else {
        // This case should ideally not be reached if signup is working correctly
        router.push('/login');
      }
    };

    fetchUserProfile();
  }, [user, loading, router]);
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading || !user || !userProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Logo className="size-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-card px-4 md:px-6">
        <Link href="/home" className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <h1 className="text-xl font-bold font-headline text-foreground">
              DavaoCycle
            </h1>
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground hidden sm:block">Welcome, {userProfile.displayName || user.email}!</p>
          <Avatar className="h-9 w-9">
            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || ''} />}
            <AvatarFallback>
              {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <UserIcon size={18} />}
            </AvatarFallback>
          </Avatar>
           <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-5 w-5 text-muted-foreground"/>
            </Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold font-headline text-primary mb-2">Find Your Ride</h1>
            <p className="text-lg text-muted-foreground mb-8">
              The e-bike map is coming soon. Get ready to explore Davao!
            </p>
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96 bg-muted/50">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-lg font-semibold text-muted-foreground">Map will be here</p>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
