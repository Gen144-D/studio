
'use client';

import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase/config';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bike, PlusCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Bike as BikeType, BikeStatus } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const bikeSchema = z.object({
  id: z.string().min(1, 'Bike ID is required.'),
  station: z.string().min(1, 'Station is required.'),
  battery: z.coerce.number().min(0).max(100),
  status: z.enum(['available', 'in-use', 'maintenance', 'low-battery', 'offline']),
  mileage: z.coerce.number().min(0),
});

const statusStyles: Record<BikeStatus, string> = {
  available: 'bg-green-100 text-green-800 border-green-200',
  'in-use': 'bg-blue-100 text-blue-800 border-blue-200',
  'low-battery': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
  offline: 'bg-gray-100 text-gray-800 border-gray-200',
};

const bikeImage = PlaceHolderImages.find((img) => img.id === 'bike-1');

export default function FleetPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [bikesCollection, loading, error] = useCollection(
    collection(firestore, 'bikes'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const bikes: BikeType[] = (bikesCollection?.docs.map(doc => ({
    ...doc.data(),
    docId: doc.id,
    lastService: doc.data().lastService.toDate ? doc.data().lastService.toDate() : new Date(doc.data().lastService),
  })) as BikeType[]) || [];

  const form = useForm<z.infer<typeof bikeSchema>>({
    resolver: zodResolver(bikeSchema),
    defaultValues: {
      id: `DC-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      station: 'SM City Davao',
      battery: 100,
      status: 'available',
      mileage: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof bikeSchema>) => {
    try {
      await addDoc(collection(firestore, 'bikes'), {
        ...values,
        lastService: serverTimestamp(),
      });
      toast({
        title: 'Success!',
        description: `Bike ${values.id} has been added to the fleet.`,
      });
      form.reset();
      setOpen(false);
    } catch (e: any) {
      console.error('Error adding document: ', e);
      toast({
        title: 'Error',
        description: `Could not add bike. ${e.message}`,
        variant: 'destructive',
      });
    }
  };


  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fleet Management</CardTitle>
            <CardDescription>
              View and manage all e-bikes in your fleet.
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Bike
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New E-Bike</DialogTitle>
                <DialogDescription>
                  Enter the details for the new bike to add it to the fleet.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bike ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., DC-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="station"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Station</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SM City Davao" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="battery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 88" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="in-use">In Use</SelectItem>
                            <SelectItem value="low-battery">Low Battery</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage (km)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 150" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <DialogFooter>
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Bike
                      </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
            <div className="text-red-500 text-center py-4">Error: {error.message}</div>
        )}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Bike ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Battery</TableHead>
                <TableHead className="hidden md:table-cell">Station</TableHead>
                <TableHead className="hidden lg:table-cell">Last Service</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bikes.map((bike) => (
                <TableRow key={bike.id}>
                  <TableCell className="hidden sm:table-cell">
                    {bikeImage && (
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={bikeImage.imageUrl}
                        width="64"
                        data-ai-hint={bikeImage.imageHint}
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium font-code">{bike.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('capitalize', statusStyles[bike.status])}
                    >
                      {bike.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn('w-2 h-2 rounded-full', {
                          'bg-green-500': bike.battery > 50,
                          'bg-yellow-500':
                            bike.battery <= 50 && bike.battery > 20,
                          'bg-red-500': bike.battery <= 20,
                        })}
                      />
                      <span className="font-code">{bike.battery}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{bike.station}</TableCell>
                  <TableCell className="hidden lg:table-cell font-code">
                    {bike.lastService ? format(new Date(bike.lastService), 'yyyy-MM-dd') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
