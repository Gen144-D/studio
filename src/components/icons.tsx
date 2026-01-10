import type { SVGProps } from "react";

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

export function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 12.81C34.553 9.173 29.632 7 24 7c-9.4 0-17 7.6-17 17s7.6 17 17 17c9.4 0 17-7.6 17-17c0-1.246-.135-2.468-.389-3.639z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691c-1.348 2.6-2.141 5.5-2.141 8.5C4.165 26.6 5.823 29.8 8.01 32.2l-4.72 4.7C1.566 33.1 0 28.7 0 24c0-4.1.99-8 2.6-11.2l3.706 1.9z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.4-5.192l-4.7-4.7c-2.8 1.9-6.2 3-9.7 3-4.5 0-8.5-2.1-11.1-5.2l-4.6 4.6C10.1 39.5 16.5 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l4.7 4.7C41.2 34.8 44 29.8 44 24c0-1.246-.135-2.468-.389-3.639z"
      />
    </svg>
  );
}
