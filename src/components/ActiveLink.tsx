'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ActiveLink({
  href,
  children,
  className = '',
  activeClassName = 'text-black',
  inactiveClassName = 'text-zinc-600 hover:text-zinc-900',
  exact = false,
  ...props
}: LinkProps & {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(String(href));
  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`}
      {...props}
    >
      {children}
    </Link>
  );
}
