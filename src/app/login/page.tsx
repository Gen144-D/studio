'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  signInWithRedirect,
} from 'firebase/auth';
import { auth, firestore } from '@/firebase/config';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Fingerprint, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { GoogleIcon, Logo } from '@/components/icons';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const handleSuccessfulLogin = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/home');
    }
  };

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const profile = await handleSocialSignIn(result.user);
          handleSuccessfulLogin(profile.role);
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Google Sign-In Failed',
          description: error.message,
        });
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkRedirect();
  }, [router, toast]);

  const handleSocialSignIn = async (user: User): Promise<UserProfile> => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const newUserProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName!,
        role: 'user', // Default role
        createdAt: Timestamp.now(),
        photoURL: user.photoURL || '',
      };
      await setDoc(userDocRef, newUserProfile);
      return newUserProfile;
    }
    return userDoc.data() as UserProfile;
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(firestore, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        handleSuccessfulLogin(profile.role);
      } else {
        // This is an edge case, user exists in Auth but not Firestore. Treat as a user.
        await setDoc(userDocRef, { role: 'user' }, { merge: true });
        handleSuccessfulLogin('user');
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const profile = await handleSocialSignIn(result.user);
      handleSuccessfulLogin(profile.role);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        toast({
          title: 'Pop-up Blocked',
          description: 'Redirecting to Google to complete sign-in...',
        });
        await signInWithRedirect(auth, provider);
      } else {
        toast({
          variant: 'destructive',
          title: 'Google Sign-In Failed',
          description: error.message,
        });
        setLoading(false);
      }
    } 
    // Don't setLoading(false) here because of redirect possibility
  };

  const handlePasskeySignIn = () => {
    toast({
      title: 'Coming Soon!',
      description: 'Passkey authentication is not yet available.',
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Logo className="size-12 animate-pulse text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-background p-4">
      <Card className="w-full max-w-sm rounded-xl shadow-lg">
        <CardHeader className="text-center space-y-4">
          <Logo className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access the DavaoCycle dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@davaocycle.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={handlePasskeySignIn}
              disabled={loading}
            >
              <Fingerprint className="mr-2 h-4 w-4" />
              Passkey
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            Don't have an account?{' '}
            <Link href="/signup" className="underline text-primary">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
