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
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: 'Fleet',
    href: '/dashboard/fleet',
    icon: <Bike size={20} />,
  },
  {
    title: 'Stations',
    href: '/dashboard/stations',
    icon: <MapPin size={20} />,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: <Users size={20} />,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart2 size={20} />,
  },
  {
    title: 'Dynamic Pricing',
    href: '/dashboard/pricing',
    icon: <DollarSign size={20} />,
  },
  {
    title: 'Maintenance',
    href: '/dashboard/maintenance',
    icon: <Wrench size={20} />,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings size={20} />,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <nav className="flex flex-col gap-2">
      <SidebarMenu>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <SidebarMenuItem key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      variant="default"
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
