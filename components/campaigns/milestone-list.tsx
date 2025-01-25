'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { VerifyMilestoneDialog } from './verify-milestone-dialog';

interface Milestone {
  id: string;
  title: string;
  description: string;
  target_date: string;
  status: 'pending' | 'completed' | 'failed';
  completion_date?: string;
}

interface MilestoneListProps {
  campaignId: string;
  milestones?: Milestone[];
  isCreator?: boolean;
}

export function MilestoneList({ campaignId, milestones = [], isCreator }: MilestoneListProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progress = (completedCount / milestones.length) * 100;
  const hasNoMilestones = milestones.length === 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Milestones</CardTitle>
        <CardDescription>
          Track progress towards campaign goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          {hasNoMilestones ? (
            <p className="text-center text-muted-foreground">No milestones have been set for this campaign.</p>
          ) : (
            <>
          <div className="flex justify-between text-sm">
            <span>{completedCount} of {milestones.length} completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
            </>
          )}
        </div>

        {!hasNoMilestones && <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-start justify-between p-4 border rounded-lg"
            >
              <div className="flex items-start gap-4">
                {getStatusIcon(milestone.status)}
                <div>
                  <h4 className="font-medium">{milestone.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(milestone.status)}
                    <span className="text-sm text-muted-foreground">
                      Due: {new Date(milestone.target_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              {isCreator && milestone.status === 'pending' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedMilestone(milestone);
                    setShowVerifyDialog(true);
                  }}
                >
                  Verify Completion
                </Button>
              )}
            </div>
          ))}
        </div>}
      </CardContent>

      <VerifyMilestoneDialog
        milestone={selectedMilestone}
        open={showVerifyDialog}
        onOpenChange={setShowVerifyDialog}
      />
    </Card>
  );
}