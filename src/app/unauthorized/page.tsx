
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const goToHome = () => {
    router.push('/home');
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/40 p-4">
      <Card className="w-full max-w-md text-center rounded-xl shadow-lg">
        <CardHeader>
            <div className="mx-auto bg-destructive/20 text-destructive p-3 rounded-full w-fit">
              <ShieldAlert className="h-10 w-10" />
            </div>
          <CardTitle className="text-3xl font-headline mt-4">Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page. This area is restricted to administrators only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
           <Button onClick={goToHome} variant="outline" className="w-full">
            Go to My Dashboard
          </Button>
          <Button onClick={handleSignOut} className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
