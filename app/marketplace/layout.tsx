'use client';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="container py-4 border-b">
        <Breadcrumbs />
      </div>
      {children}
    </div>
  );
}