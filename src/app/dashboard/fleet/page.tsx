
import { Bike, PlusCircle } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Bike as BikeType, BikeStatus } from '@/lib/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const bikes: BikeType[] = [
  { id: 'DC-001', station: 'SM City Davao', battery: 98, status: 'available', lastService: '2024-05-10', mileage: 120 },
  { id: 'DC-002', station: 'Abreeza Mall', battery: 45, status: 'in-use', lastService: '2024-05-12', mileage: 345 },
  { id: 'DC-003', station: 'Gaisano Mall', battery: 15, status: 'low-battery', lastService: '2024-04-20', mileage: 890 },
  { id: 'DC-004', station: 'SM Lanang', battery: 76, status: 'available', lastService: '2024-05-18', mileage: 210 },
  { id: 'DC-005', station: 'Maintenance Depot', battery: 0, status: 'maintenance', lastService: '2024-05-01', mileage: 1502 },
  { id: 'DC-006', station: 'SM City Davao', battery: 89, status: 'available', lastService: '2024-05-20', mileage: 150 },
  { id: 'DC-007', station: 'Victoria Plaza', battery: 100, status: 'available', lastService: '2024-05-22', mileage: 55 },
  { id: 'DC-008', station: 'N/A', battery: 0, status: 'offline', lastService: '2024-03-15', mileage: 2400 },
];

const statusStyles: Record<BikeStatus, string> = {
  available: 'bg-green-100 text-green-800 border-green-200',
  'in-use': 'bg-blue-100 text-blue-800 border-blue-200',
  'low-battery': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  maintenance: 'bg-orange-100 text-orange-800 border-orange-200',
  offline: 'bg-gray-100 text-gray-800 border-gray-200',
};

const bikeImage = PlaceHolderImages.find((img) => img.id === 'bike-1');

export default function FleetPage() {
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
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Bike
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                <TableCell className="hidden lg:table-cell font-code">{bike.lastService}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
