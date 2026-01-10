import type { SVGProps } from "react";
import { LogOut } from 'lucide-react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8Z" />
      <path d="M12 12v4" />
      <path d="M12 8v.01" />
      <path d="m4.5 13.5 3-3" />
      <path d="m16.5 7.5 3 3" />
      <path d="M12 20a8 8 0 0 0 5.66-2.34" />
      <path d="M4.34 17.66A8 8 0 0 0 12 20" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  );
}

export { LogOut };
