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
import { AlertTriangle } from 'lucide-react';
import { requestConsequenceTrigger } from '@/lib/actions/consequences';

interface TriggerConsequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  type: 'success' | 'failure';
  description: string;
}

export function TriggerConsequenceDialog({
  open,
  onOpenChange,
  campaignId,
  type,
  description,
}: TriggerConsequenceDialogProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTrigger = async () => {
    try {
      setIsSubmitting(true);
      await requestConsequenceTrigger({
        campaign_id: campaignId,
        type,
        notes: notes.trim()
      });

      toast({
        title: 'Request Submitted',
        description: 'An admin will review your consequence trigger request.',
      });

      onOpenChange(false);
      setNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
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
          <DialogTitle>Trigger {type === 'success' ? 'Success' : 'Failure'} Consequence</DialogTitle>
          <DialogDescription>
            Request to trigger the {type} consequence for this campaign.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Consequence Description</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Additional Notes
            </label>
            <Textarea
              placeholder="Provide any relevant details or justification..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <p>
              This request will be reviewed by an admin before the consequence is triggered.
              You will be notified once the request is processed.
            </p>
          </div>
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
            onClick={handleTrigger}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}