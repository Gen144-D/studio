'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
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
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { GoogleIcon } from '@/components/icons';
import type { User } from 'firebase/auth';

// Function to create a user document in Firestore
export const createUserDocument = async (user: User) => {
  const userDocRef = doc(firestore, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  // Only create document if it doesn't exist
  if (!userDoc.exists()) {
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: 'user', // Always default to 'user' on signup
      createdAt: Timestamp.now(),
      photoURL: user.photoURL,
    };
    await setDoc(userDocRef, userProfile);
  }
};

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

   useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          await createUserDocument(result.user);
          router.push('/dashboard');
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


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Please enter your full name.',
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName });
      
      // We need to reload the user to get the updated displayName
      await userCredential.user.reload();
      const updatedUser = auth.currentUser;

      if (updatedUser) {
        await createUserDocument(updatedUser);
        router.push('/dashboard');
      } else {
        throw new Error("Could not get updated user information.");
      }

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
         toast({
          variant: 'destructive',
          title: 'Email Already In Use',
          description: 'This email is already registered. Please sign in.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await createUserDocument(result.user);
      router.push('/dashboard');
    } catch (error: any) {
       if (error.code === 'auth/popup-blocked') {
        toast({
          title: 'Pop-up Blocked',
          description: 'Redirecting to Google to complete sign-up...',
        });
        await signInWithRedirect(auth, provider);
      } else {
        toast({
          variant: 'destructive',
          title: 'Google Sign-In Failed',
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/40 p-4">
      <Card className="w-full max-w-sm rounded-xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">
            Create an Account
          </CardTitle>
          <CardDescription>
            Join DavaoCycle to start your journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Juan Dela Cruz"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>              <Input
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
              Sign Up
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
