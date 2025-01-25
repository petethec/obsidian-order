'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, Target, Vote, AlertTriangle, Heart, Gift } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CampaignListProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    type: string;
    current_amount: number;
    funding_goal: number;
    pledges: number;
    success_type: 'reward' | 'stretch' | 'community';
    failure_type: 'refund' | 'charity' | 'challenge';
    success_description: string;
    failure_description: string;
  };
}

export function CampaignList({ campaign }: CampaignListProps) {
  const progress = (campaign.current_amount / campaign.funding_goal) * 100;

  const getConsequenceIcon = (type: string) => {
    switch (type) {
      case 'reward':
        return <Gift className="h-5 w-5" />;
      case 'stretch':
        return <Target className="h-5 w-5" />;
      case 'community':
        return <Heart className="h-5 w-5" />;
      case 'refund':
        return <CircleDollarSign className="h-5 w-5" />;
      case 'charity':
        return <Heart className="h-5 w-5" />;
      case 'challenge':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Link href={`/campaigns/${campaign.id}`} className="block">
      <Card className={cn(
        "group hover:border-primary transition-all duration-300 cursor-pointer",
        "hover:shadow-lg hover:shadow-primary/5"
      )}>
        <CardContent className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Campaign Info */}
            <div className="col-span-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span className="capitalize">{campaign.type.replace('_', ' ')}</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {campaign.description}
                </p>
              </div>
            </div>

            {/* Progress & Stats */}
            <div className="col-span-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${campaign.current_amount.toLocaleString()}</span>
                    <span>${campaign.funding_goal.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(progress)}% funded</span>
                    <span>{campaign.pledges?.toLocaleString() || 0} pledges</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consequences */}
            <div className="col-span-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  {getConsequenceIcon(campaign.success_type)}
                  <span className="text-sm font-medium">Success Outcome</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {campaign.success_description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex items-center justify-end">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}