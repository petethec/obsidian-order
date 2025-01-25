'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, Target, Vote, AlertTriangle, Heart, Gift } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Map campaign types to specific Unsplash search terms for better images
const CAMPAIGN_IMAGES = {
  'corporate_advocacy': 'business+meeting',
  'government': 'government+building',
  'innovation': 'technology+innovation',
  'competitive_innovation': 'competition+technology',
  'fail_forward': 'challenge+success',
  'refundable_milestone': 'milestone+achievement'
};

interface CampaignCardProps {
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

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const progress = (campaign.current_amount / campaign.funding_goal) * 100;

  // Map campaign types to specific Unsplash images
  const campaignImages = {
    'corporate_advocacy': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
    'government': 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c',
    'innovation': 'https://images.unsplash.com/photo-1579165466741-7f35e4755660',
    'competitive_innovation': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f',
    'fail_forward': 'https://images.unsplash.com/photo-1553484771-371a605b060b',
    'refundable_milestone': 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7'
  };

  const imageUrl = campaignImages[campaign.type as keyof typeof campaignImages] || 
    'https://images.unsplash.com/photo-1536859355448-76f92ebdc33d';

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
      <Card 
        className="campaign-card group relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={`${imageUrl}?w=800&q=80`}
            alt={campaign.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
              <Target className="h-4 w-4" />
              <span className="capitalize">{campaign.type.replace('_', ' ')}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{campaign.title}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="consequence-type">
            <div className="flex items-center gap-2 text-primary mb-1">
              {getConsequenceIcon(campaign.success_type)}
              <span className="font-medium capitalize">At Stake</span>
            </div>
            <p className={cn(
              "text-sm text-muted-foreground line-clamp-2 transition-all duration-300",
              isHovered && "line-clamp-none"
            )}>
              {isHovered ? campaign.failure_description : campaign.success_description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="progress-bar">
              <div 
                className="absolute inset-0 transition-transform duration-1000"
                style={{ transform: `translateX(${progress}%)` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>${campaign.current_amount.toLocaleString()} raised</span>
              <span>${campaign.funding_goal.toLocaleString()} goal</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Vote className="h-4 w-4 text-primary" />
              <span>{campaign.pledges?.toLocaleString() || 0} pledges</span>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Consequence Proximity Indicator */}
      <div 
        className={cn(
          "absolute top-0 right-0 w-1 transition-all duration-500",
          progress < 50 ? "bg-destructive/60" : "bg-primary/60",
          "h-0 group-hover:h-full"
        )}
      />
      </Card>
    </Link>
  );
}