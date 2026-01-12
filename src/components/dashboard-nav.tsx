'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BarChart2,
  Bike,
  DollarSign,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
  Wrench,
} from 'lucide-react';
import type { NavItem } from '@/lib/types';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard />,
  },
  {
    title: 'Fleet',
    href: '/dashboard/fleet',
    icon: <Bike />,
  },
  {
    title: 'Stations',
    href: '/dashboard/stations',
    icon: <MapPin />,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: <Users />,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart2 />,
  },
  {
    title: 'Dynamic Pricing',
    href: '/dashboard/pricing',
    icon: <DollarSign />,
  },
  {
    title: 'Maintenance',
    href: '/dashboard/maintenance',
    icon: <Wrench />,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <nav className="flex flex-col">
      <SidebarMenu>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <SidebarMenuItem key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className="w-full"
                    >
                      {item.icon}
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                {state === 'collapsed' && (
                  <TooltipContent side="right" align="center">
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </nav>
  );
}
