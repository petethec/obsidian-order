'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Vote } from 'lucide-react';
import { castVote } from '@/lib/actions/votes';

interface VoteCardProps {
  campaignId: string;
  totalVotes: number;
  hasVoted?: boolean;
  onVote?: () => void;
}

export function VoteCard({
  campaignId,
  totalVotes,
  hasVoted = false,
  onVote,
}: VoteCardProps) {
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    try {
      setIsVoting(true);
      await castVote({ campaign_id: campaignId });
      
      toast({
        title: 'Vote Cast',
        description: 'Your vote has been recorded successfully.',
      });

      onVote?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cast vote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote for Solution</CardTitle>
        <CardDescription>
          Support your preferred solution in this innovation challenge
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              <span className="font-medium">{totalVotes} votes</span>
            </div>
            <Button
              onClick={handleVote}
              disabled={isVoting || hasVoted}
            >
              {hasVoted ? 'Already Voted' : isVoting ? 'Casting Vote...' : 'Cast Vote'}
            </Button>
          </div>
          {hasVoted && (
            <p className="text-sm text-muted-foreground">
              You have already voted for this solution
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}