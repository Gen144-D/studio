'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  predictEBikeMaintenance,
  type PredictEBikeMaintenanceOutput,
} from '@/ai/flows/predict-ebike-maintenance';
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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  usagePatterns: z.string().min(10, 'Please provide more detail.'),
  sensorData: z.string().min(10, 'Please provide more detail.'),
  historicalMaintenanceRecords: z
    .string()
    .min(10, 'Please provide more detail.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function PredictiveMaintenancePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<PredictEBikeMaintenanceOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usagePatterns: 'Daily mileage: 25km, Avg speed: 18km/h, Usage: 5 days/week.',
      sensorData: 'Battery health: 85%, Motor temp: 45°C, Tire pressure: 40 PSI.',
      historicalMaintenanceRecords: 'Last service: 3 months ago (brake pads replaced). Previous: 6 months ago (chain cleaned and lubricated).',
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    try {
      const output = await predictEBikeMaintenance(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description:
          'Failed to get maintenance prediction. Please try again.',
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
          <CardTitle>Predictive Maintenance</CardTitle>
          <CardDescription>
            Use AI to forecast e-bike maintenance needs.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="usagePatterns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Patterns</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Daily mileage, average speed..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sensorData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sensor Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Battery health, motor temp..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalMaintenanceRecords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Maintenance Records</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Last service date..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Predict Maintenance
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="flex items-center justify-center">
        {loading && (
          <div className="text-center text-muted-foreground">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2">Running prediction model...</p>
          </div>
        )}
        {result && (
          <Card className="w-full rounded-xl shadow-sm bg-secondary">
            <CardHeader>
              <CardTitle>Maintenance Prediction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-background">
                <Calendar className="h-4 w-4" />
                <AlertTitle>Predicted Maintenance Date</AlertTitle>
                <AlertDescription className="font-bold text-lg text-primary font-headline">
                  {new Date(result.predictedMaintenanceDate).toLocaleDateString(
                    'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-2">Confidence Level</h4>
                <div className="flex items-center gap-4">
                  <Progress value={result.confidenceLevel * 100} className="w-full" />
                  <span className="font-bold text-primary font-code">
                    {(result.confidenceLevel * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <div className="space-y-2 text-sm text-muted-foreground bg-background p-4 rounded-lg border">
                  {result.maintenanceRecommendations.split('. ').filter(s => s).map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
