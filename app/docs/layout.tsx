'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/database-schema', label: 'Database Schema' },
  { href: '/docs/api-endpoints', label: 'API Endpoints' },
  { href: '/docs/code-structure', label: 'Code Structure' },
  { href: '/docs/consequence-handling', label: 'Consequence Handling' },
  { href: '/docs/admin-workflows', label: 'Admin Workflows' },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container py-10">
      <div className="flex gap-12">
        {/* Sidebar Navigation */}
        <div className="w-64 shrink-0">
          <nav className="sticky top-24 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="prose dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}