'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Store } from 'lucide-react';

const routes = {
  '/marketplace': {
    label: 'Marketplace',
    icon: Store,
  },
  '/marketplace/sell': {
    label: 'Sell Campaign',
  },
  '/marketplace/listings': {
    label: 'My Listings',
  },
  '/marketplace/agreements': {
    label: 'Legacy Agreements',
  },
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const route = routes[path as keyof typeof routes];
    
    if (!route) return null;
    
    const Icon = route.icon;
    
    return {
      path,
      label: route.label,
      icon: Icon,
      isLast: index === segments.length - 1,
    };
  }).filter(Boolean);

  if (breadcrumbs.length <= 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-1" />
          )}
          
          <div className="flex items-center">
            {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
            {crumb.isLast ? (
              <span className="font-medium text-foreground">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.path}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}