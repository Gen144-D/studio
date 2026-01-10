export type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

export type BikeStatus = 'available' | 'in-use' | 'maintenance' | 'low-battery' | 'offline';

export type Bike = {
  id: string;
  station: string;
  battery: number;
  status: BikeStatus;
  lastService: string;
  mileage: number;
};

export type ActiveRental = {
  renterName: string;
  renterAvatar: string;
  bikeId: string;
  startTime: Date;
  currentAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
};
