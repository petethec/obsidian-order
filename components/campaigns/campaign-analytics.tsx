'use client';

import { useEffect } from 'react';
import { event as logAnalyticsEvent } from '@/lib/analytics';

export function CampaignAnalytics({ title }: { title: string }) {
  useEffect(() => {
    logAnalyticsEvent({
      action: 'view_campaign',
      category: 'engagement',
      label: title,
    });
  }, [title]);

  return null;
} 