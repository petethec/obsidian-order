'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleDollarSign, Target, Vote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getMockCampaigns } from '@/lib/mock-data';

export default function CampaignsPage() {
  const campaigns = Object.values(getMockCampaigns());

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Explore and support innovative projects
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="group relative hover:border-primary transition-colors">
              <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={`https://source.unsplash.com/800x400/?${campaign.type.replace('_', '+')}`}
                    alt={campaign.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Target className="h-4 w-4" />
                  <span className="capitalize">{campaign.type.replace('_', ' ')}</span>
                </div>
                <CardTitle className="text-xl mb-2">{campaign.title}</CardTitle>
                <CardDescription className="mb-4">
                  {campaign.description}
                </CardDescription>
                <div className="space-y-2">
                  <div className="bg-secondary h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(campaign.current_amount / campaign.funding_goal) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>${campaign.current_amount.toLocaleString()} raised</span>
                    <span>${campaign.funding_goal.toLocaleString()} goal</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Vote className="h-4 w-4 text-primary" />
                    <span>{campaign.pledges.toLocaleString()} pledges</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}