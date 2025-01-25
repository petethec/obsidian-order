'use client';

import { useEffect } from 'react';

interface CampaignViewTrackerProps {
  title: string;
}

export function CampaignViewTracker({ title }: CampaignViewTrackerProps) {
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'view_campaign',
        category: 'engagement',
        label: title
      })
    }).catch(console.error);
  }, [title]);

  return null;
} 