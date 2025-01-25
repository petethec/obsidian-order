'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { verifyMilestone } from '@/lib/actions/milestones';

interface Milestone {
  id: string;
  title: string;
  description: string;
  target_date: string;
  status: 'pending' | 'completed' | 'failed';
}

interface VerifyMilestoneDialogProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerifyMilestoneDialog({
  milestone,
  open,
  onOpenChange,
}: VerifyMilestoneDialogProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!milestone) return;

    try {
      setIsSubmitting(true);
      await verifyMilestone({
        milestone_id: milestone.id,
        notes,
        status: 'approved'
      });

      toast({
        title: 'Milestone Verified',
        description: 'The milestone has been marked as completed.',
      });

      onOpenChange(false);
      setNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify milestone. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Milestone Completion</DialogTitle>
          <DialogDescription>
            Confirm that this milestone has been completed successfully.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {milestone && (
            <>
              <div>
                <h4 className="font-medium">{milestone.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Verification Notes
                </label>
                <Textarea
                  placeholder="Provide details about how the milestone was completed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isSubmitting || !notes.trim()}
          >
            {isSubmitting ? 'Verifying...' : 'Verify Completion'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}