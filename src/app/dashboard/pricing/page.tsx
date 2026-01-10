'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  adjustRentalPrice,
  type AdjustRentalPriceOutput,
} from '@/ai/flows/dynamic-pricing-adjustment';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  currentDemand: z.enum(['low', 'medium', 'high']),
  weatherCondition: z.enum(['sunny', 'cloudy', 'rainy']),
  eBikeAvailability: z.enum(['low', 'medium', 'high']),
  basePrice: z.coerce.number().min(1, 'Base price must be at least 1.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function DynamicPricingPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdjustRentalPriceOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentDemand: 'medium',
      weatherCondition: 'sunny',
      eBikeAvailability: 'high',
      basePrice: 120,
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    try {
      const output = await adjustRentalPrice(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get pricing suggestion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Dynamic Pricing Tool</CardTitle>
          <CardDescription>
            Get AI-powered price adjustments based on real-time factors.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="currentDemand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Demand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select demand level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select weather condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eBikeAvailability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Bike Availability</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (₱)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 120"
                        {...field}
                        className="font-code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adjust Price
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <div className="flex items-center justify-center">
        {loading && (
          <div className="text-center text-muted-foreground">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2">Analyzing data...</p>
          </div>
        )}
        {result && (
          <Card className="w-full rounded-xl shadow-sm bg-secondary">
            <CardHeader>
              <CardTitle>Pricing Suggestion</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
               <div className="flex justify-center items-baseline gap-4">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    <p className="text-2xl font-bold font-code text-muted-foreground line-through">₱{form.getValues('basePrice').toFixed(2)}</p>
                </div>
                 <div className="text-center">
                    <p className="text-lg text-primary">Adjusted Price</p>
                    <p className="text-5xl font-bold font-headline text-primary">₱{result.adjustedPrice.toFixed(2)}</p>
                 </div>
               </div>
              <div className="text-left bg-background p-4 rounded-lg border">
                <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="text-primary w-4 h-4"/> Reasoning</h4>
                <p className="text-sm text-muted-foreground mt-2">{result.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
