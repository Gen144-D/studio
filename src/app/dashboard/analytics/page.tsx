'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const usageData = [
  { time: '6 AM', rentals: 12 },
  { time: '8 AM', rentals: 45 },
  { time: '10 AM', rentals: 78 },
  { time: '12 PM', rentals: 110 },
  { time: '2 PM', rentals: 95 },
  { time: '4 PM', rentals: 130 },
  { time: '6 PM', rentals: 150 },
  { time: '8 PM', rentals: 80 },
];

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 48000 },
  { month: 'Mar', revenue: 55000 },
  { month: 'Apr', revenue: 62000 },
  { month: 'May', revenue: 78000 },
  { month: 'Jun', revenue: 95000 },
];

const chartConfig: ChartConfig = {
  rentals: {
    label: 'Rentals',
    color: 'hsl(var(--primary))',
  },
  revenue: {
    label: 'Revenue (₱)',
    color: 'hsl(var(--success))',
  },
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Analytics & Reporting</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Usage Patterns - Peak Hours</CardTitle>
            <CardDescription>
              Number of rentals started per time slot today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={usageData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="rentals" fill="var(--color-rentals)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Forecasting</CardTitle>
            <CardDescription>
              Monthly revenue trends and projections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={revenueData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickFormatter={(value) => `₱${value / 1000}k`}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="revenue"
                  type="monotone"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{
                    fill: 'var(--color-revenue)',
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
