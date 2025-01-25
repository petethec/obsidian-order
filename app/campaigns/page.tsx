'use client';

import { useState } from 'react';
import { CampaignCard } from '@/components/campaigns/campaign-card';
import { CampaignList } from '@/components/campaigns/campaign-list-view';
import { getMockCampaigns } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Grid2X2, List } from 'lucide-react';

export default function CampaignsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const campaigns = Object.values(getMockCampaigns());

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Active Campaigns</h1>
            <p className="text-muted-foreground">
              Support campaigns that drive real change through consequence-based action.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <CampaignList key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}