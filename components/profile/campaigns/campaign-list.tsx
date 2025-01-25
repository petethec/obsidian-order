'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface Campaign {
  id: string;
  title: string;
  status: string;
  current_amount: number;
  funding_goal: number;
}

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Your Campaigns
        </h3>
        <Button onClick={() => router.push('/create')}>
          Create Campaign
        </Button>
      </div>
      <div className="space-y-4">
        {campaigns.map(campaign => (
          <Card 
            key={campaign.id} 
            className="cursor-pointer hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            onClick={() => router.push(`/campaigns/${campaign.id}`)}
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    {campaign.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="capitalize">{campaign.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                    ${campaign.current_amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    of ${campaign.funding_goal.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-secondary h-2 rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{
                      width: `${(campaign.current_amount / campaign.funding_goal) * 100}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}