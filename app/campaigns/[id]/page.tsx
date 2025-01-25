import { Suspense, cache } from 'react';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleDollarSign, Target, Vote, Calendar, AlertTriangle, Heart, Gift } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { CampaignUpdates } from '@/components/campaigns/campaign-updates';
import { SupporterComments } from '@/components/campaigns/supporter-comments';
import { getMockCampaigns } from '@/lib/mock-data';
import { PledgeForm } from '@/components/campaigns/pledge-form';
import { MilestoneList } from '@/components/campaigns/milestone-list';
import { ReputationCard } from '@/components/profile/reputation-card';
import { ShareCard } from '@/components/campaigns/share-card';
import { VoteCard } from '@/components/campaigns/vote-card';
import { CampaignViewTracker } from '@/components/analytics/campaign-view-tracker';

// Generate static params for all campaign IDs
export async function generateStaticParams() {
  return [
    { id: 'ceo-climate-action' },
    { id: 'fact-checker' },
    { id: 'public-apology' },
    { id: 'voter-pledge' },
    { id: 'insulin-challenge' },
    { id: 'ceo-climate-action' },
    { id: 'clean-energy' },
    { id: 'education-reform' },
    { id: 'healthcare-access' }
  ];
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  type: 'government' | 'innovation';
  current_amount: number;
  funding_goal: number;
  start_date: string;
  end_date: string;
  target: string;
  success_type: 'reward' | 'stretch' | 'community';
  success_description: string;
  failure_type: 'refund' | 'charity' | 'challenge';
  failure_description: string;
  creator: {
    username: string;
    avatar_url: string | null;
  };
  pledges: number;
}

function CampaignSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-2 w-24" />
      <Skeleton className="h-4 w-48" />
      <div className="space-y-2">
        <Skeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// Generate metadata for each campaign
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // For static export, use hardcoded metadata based on campaign ID
  const campaignMetadata = {
    'ceo-climate-action': {
      title: 'CEO Pay Cut for Climate Action',
      description: 'Challenge airline CEO to take 50% pay cut until achieving climate goals.',
    },
    'fact-checker': {
      title: 'Fund a Fact-Checker',
      description: 'Support independent fact-checking to combat online misinformation.',
    },
    'public-apology': {
      title: 'The Ultimate Public Apology',
      description: 'Campaign for corporate accountability and meaningful change.',
    },
    'voter-pledge': {
      title: 'Climate Action Voter Pledge',
      description: 'Join the movement to elect climate-conscious leaders through collective voter action.',
    },
    'insulin-challenge': {
      title: 'Open-Source Insulin Challenge',
      description: 'Join the mission to develop affordable, open-source insulin manufacturing.',
    },
    'ceo-climate-action': {
      title: 'CEO Pay Cut for Climate Action',
      description: 'Challenge airline CEO to take 50% pay cut until achieving climate goals.',
    },
    'clean-energy': {
      title: 'Clean Energy Initiative',
      description: 'Support the transition to 100% renewable energy in our city by 2030.',
    },
    'education-reform': {
      title: 'Education Reform',
      description: 'Push for comprehensive education reform in underserved communities.',
    },
    'healthcare-access': {
      title: 'Healthcare Access',
      description: 'Expand healthcare access to rural communities through mobile clinics.',
    },
  }[params.id] || {
    title: 'Campaign Not Found',
    description: 'The campaign you\'re looking for doesn\'t exist or has been removed.',
  };

  return {
    title: campaignMetadata.title,
    description: campaignMetadata.description,
  };
}

const getCampaign = cache(async (id: string): Promise<Campaign | null> => {
  // For static export, use hardcoded campaign data
  const mockCampaigns = getMockCampaigns();
  return Promise.resolve(mockCampaigns[id as keyof typeof mockCampaigns] || null);
});

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = getMockCampaigns()[params.id as keyof ReturnType<typeof getMockCampaigns>];

  if (!campaign) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="py-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Campaign Not Found</h2>
              <p className="text-muted-foreground">
                The campaign you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild className="mt-4">
                <a href="/campaigns">View All Campaigns</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = (campaign.current_amount / campaign.funding_goal) * 100;
  const endDate = new Date(campaign.end_date);
  const daysLeft = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isCreator = false;
  const creatorReputation = campaign.creator?.reputation || {
    score: 0,
    successful_campaigns: 0,
    total_raised: 0,
    total_backers: 0,
    achievements: []
  };

  // Mock updates data
  const updates = [
    {
      id: '1',
      title: 'First Milestone Reached!',
      content: 'We\'re excited to announce that we\'ve reached our first milestone ahead of schedule. The team has been working tirelessly...',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'milestone',
      likes: 156,
      comments: 23
    },
    {
      id: '2',
      title: 'Important Campaign Update',
      content: 'We\'ve received overwhelming support from the community and wanted to share some exciting developments...',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'important',
      likes: 89,
      comments: 12
    }
  ];

  // Mock comments data
  const comments = [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        pledgeAmount: 500
      },
      content: 'This is exactly the kind of initiative we need. I\'m proud to support this campaign and hope others will join in.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 45,
      replies: 8,
      isVerifiedBacker: true
    },
    {
      id: '2',
      author: {
        name: 'Michael Chen',
        pledgeAmount: 250
      },
      content: 'The transparency and regular updates from the team are impressive. Keep up the great work!',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likes: 32,
      replies: 5,
      isVerifiedBacker: true
    }
  ];

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

  return (
    <>
      <CampaignViewTracker title={campaign.title} />
      <div className="container py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={`${imageUrl}?w=800&q=80`}
                alt={campaign.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{campaign.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span className="capitalize">{campaign.type.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="prose dark:prose-invert">
                <p>{campaign.description}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Success Outcome</CardTitle>
                  <CardDescription>What happens if we reach our goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    {campaign.success_type === 'reward' && <Gift className="h-5 w-5" />}
                    {campaign.success_type === 'stretch' && <Target className="h-5 w-5" />}
                    {campaign.success_type === 'community' && <Heart className="h-5 w-5" />}
                    <span className="capitalize">{campaign.success_type}</span>
                  </div>
                  <p>{campaign.success_description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Failure Outcome</CardTitle>
                  <CardDescription>What happens if we don&apos;t reach our goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-destructive mb-2">
                    {campaign.failure_type === 'refund' && <CircleDollarSign className="h-5 w-5" />}
                    {campaign.failure_type === 'charity' && <Heart className="h-5 w-5" />}
                    {campaign.failure_type === 'challenge' && <AlertTriangle className="h-5 w-5" />}
                    <span className="capitalize">{campaign.failure_type}</span>
                  </div>
                  <p>{campaign.failure_description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Milestones Section */}
            <MilestoneList
              campaignId={campaign.id}
              milestones={campaign.milestones}
              isCreator={isCreator}
            />

            {/* Updates Section */}
            <CampaignUpdates updates={updates} />

            {/* Comments Section */}
            <SupporterComments comments={comments} />

            {/* Voting Section - Only show for competitive innovation campaigns */}
            {campaign.type === 'competitive_innovation' && (
              <VoteCard
                campaignId={campaign.id}
                totalVotes={campaign.votes}
                hasVoted={campaign.hasVoted}
              />
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Suspense fallback={<CampaignSkeleton />}>
                    <div>
                      <div className="text-2xl font-bold">
                        ${campaign.current_amount.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        of ${campaign.funding_goal.toLocaleString()} goal
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-secondary h-2 rounded-full">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{Math.round(progress)}% funded</span>
                        <span>{daysLeft} days left</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Vote className="h-4 w-4 text-primary" />
                      <span>{campaign.pledges.toLocaleString()} pledges</span>
                    </div>

                    <PledgeForm campaignId={campaign.id} />
                  </Suspense>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Target</div>
                  <div className="font-medium">{campaign.target}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Start Date</div>
                  <div className="font-medium">
                    {new Date(campaign.start_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">End Date</div>
                  <div className="font-medium">
                    {new Date(campaign.end_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Created By</div>
                  <div className="font-medium">{campaign.creator.username}</div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Reputation */}
            <ReputationCard
              score={creatorReputation.score}
              successfulCampaigns={creatorReputation.successful_campaigns}
              totalRaised={creatorReputation.total_raised}
              totalBackers={creatorReputation.total_backers}
              achievements={creatorReputation.achievements}
            />

            {/* Share Card */}
            <ShareCard
              campaignId={campaign.id}
              title={campaign.title}
              description={campaign.description}
            />
          </div>
        </div>
      </div>
    </>
  );
}