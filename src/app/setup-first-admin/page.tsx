'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, firestore } from '@/firebase/config';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import { createUserDocument } from '../signup/page';
import type { User } from 'firebase/auth';

export default function SetupFirstAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName) {
      toast({
        variant: 'destructive',
        title: 'Setup Failed',
        description: 'Please enter your full name.',
      });
      return;
    }
    setLoading(true);

    try {
      let userCredential;
      try {
        // First, try to sign in. This handles the case where auth user exists but doc doesn't.
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // If display name is different, update it
        if (userCredential.user.displayName !== displayName) {
          await updateProfile(userCredential.user, { displayName });
          await userCredential.user.reload();
        }

      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          // If user doesn't exist, create a new one
          userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await updateProfile(userCredential.user, { displayName });
          await userCredential.user.reload();
        } else {
          // For other errors (like wrong password), re-throw
          throw error;
        }
      }
      
      const updatedUser = userCredential.user;

      if (updatedUser) {
        // Create or overwrite user document with admin role
        const userDocRef = doc(firestore, 'users', updatedUser.uid);
        await setDoc(userDocRef, {
            uid: updatedUser.uid,
            email: updatedUser.email,
            displayName: updatedUser.displayName,
            role: 'admin',
            photoURL: updatedUser.photoURL,
            createdAt: new Date().toISOString(),
        }, { merge: true }); // Use merge to be safe
      } else {
        throw new Error("Could not get updated user information.");
      }
      
      toast({
        title: 'Admin Account Configured',
        description: 'You can now log in with your admin credentials.',
      });

      router.push('/login');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Admin Setup Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/40 p-4">
      <Card className="w-full max-w-sm rounded-xl shadow-lg border-primary/50">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit bg-primary/20 p-3 rounded-full text-primary">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-headline mt-2">
            Create First Admin
          </CardTitle>
          <CardDescription>
            This one-time setup will create the primary administrator account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetupAdmin} className="space-y-4">
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
              Create Admin Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
