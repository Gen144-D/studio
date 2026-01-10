import {
  Activity,
  Bike,
  DollarSign,
  MapPin,
  MoreHorizontal,
} from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ActiveRental } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const activeRentals: ActiveRental[] = [
  {
    renterName: 'Juan Dela Cruz',
    renterAvatar:
      PlaceHolderImages.find((img) => img.id === 'user-avatar-1')?.imageUrl || '',
    bikeId: 'DC-042',
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    currentAmount: 120,
    paymentStatus: 'Pending',
  },
  {
    renterName: 'Maria Clara',
    renterAvatar:
      PlaceHolderImages.find((img) => img.id === 'user-avatar-2')?.imageUrl || '',
    bikeId: 'DC-133',
    startTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    currentAmount: 170,
    paymentStatus: 'Pending',
  },
];

function formatDuration(startTime: Date) {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bikes</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">250</div>
            <p className="text-xs text-muted-foreground">180 Available</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">42</div>
            <p className="text-xs text-muted-foreground">+15% from last hour</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">12</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">
              <span className="font-code">₱12,450</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Projected: ₱25,000
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Live Rental Monitoring</CardTitle>
          <CardDescription>
            An overview of all ongoing e-bike rentals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Renter</TableHead>
                <TableHead>Bike ID</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeRentals.map((rental) => (
                <TableRow key={rental.bikeId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={rental.renterAvatar} />
                        <AvatarFallback>
                          {rental.renterName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{rental.renterName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-code">{rental.bikeId}</span>
                  </TableCell>
                  <TableCell>{formatDuration(rental.startTime)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        rental.paymentStatus === 'Pending'
                          ? 'outline'
                          : 'destructive'
                      }
                    >
                      {rental.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-code">
                    ₱{rental.currentAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Send Notification</DropdownMenuItem>
                        <DropdownMenuItem>Lock Bike</DropdownMenuItem>
                        <DropdownMenuItem>End Rental</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
