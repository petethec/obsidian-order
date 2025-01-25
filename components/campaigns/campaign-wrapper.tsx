'use client';

import { CampaignAnalytics } from './campaign-analytics';

export function CampaignWrapper({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <>
      <CampaignAnalytics title={title} />
      {children}
    </>
  );
} 