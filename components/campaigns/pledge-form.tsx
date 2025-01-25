'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAuth } from '@/components/auth-provider';
import { getMockCampaigns } from '@/lib/mock-data';
import { createPledge } from '@/lib/actions/pledges';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Vote } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PLEDGE_TIERS = [
  { amount: 25, label: 'Supporter' },
  { amount: 50, label: 'Advocate' },
  { amount: 100, label: 'Champion' },
  { amount: 250, label: 'Leader' },
  { amount: 500, label: 'Visionary' },
];

const formSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
});

interface PledgeFormProps {
  campaignId: string;
  minAmount?: number;
}

export function PledgeForm({ campaignId, minAmount = 1 }: PledgeFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [localProgress, setLocalProgress] = useState<number>(0);
  const [localAmount, setLocalAmount] = useState<number>(0);
  const [campaign, setCampaign] = useState(getMockCampaigns()[campaignId]);

  useEffect(() => {
    setCampaign(getMockCampaigns()[campaignId]);
  }, [campaignId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: minAmount,
    },
  });

  const handlePledgeTierSelect = (amount: number) => {
    form.setValue('amount', amount);
    setSelectedAmount(amount);

    if (campaign) {
      const newAmount = campaign.current_amount + amount;
      const newProgress = (newAmount / campaign.funding_goal) * 100;
      setLocalAmount(newAmount);
      setLocalProgress(newProgress);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to support this campaign.',
        variant: 'destructive',
      });
      router.push('/login');
      return;
    }

    setSelectedAmount(values.amount);
    setLocalAmount(values.amount);

    if (campaign) {
      const newAmount = campaign.current_amount + values.amount;
      const newProgress = (newAmount / campaign.funding_goal) * 100;
      setLocalProgress(newProgress);
    }
    setShowConfirmation(true);
  }

  async function handleConfirmedPledge() {
    if (!selectedAmount) return;

    if (!campaign) return;

    try {
      setIsLoading(true);
      await createPledge({
        campaign_id: campaignId,
        backer_id: user.id,
        amount: selectedAmount,
        status: 'pending'
      });

      toast({
        title: 'Pledge Successful',
        description: `Thank you for pledging $${selectedAmount.toLocaleString()}!`,
      });

      // Reset local state
      setLocalAmount(0);
      setLocalProgress(0);

      setShowConfirmation(false);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process your pledge. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to create pledge:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const displayAmount = localAmount || campaign?.current_amount || 0;
  const displayProgress = localProgress || ((campaign?.current_amount || 0) / (campaign?.funding_goal || 1)) * 100;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormLabel>Select a Pledge Tier</FormLabel>
            <div className="grid grid-cols-2 gap-4 relative">
              {PLEDGE_TIERS.map((tier) => (
                <button
                  key={tier.amount}
                  type="button"
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300",
                    "hover:border-primary hover:bg-primary/5 hover:scale-105",
                    "hover:shadow-lg hover:shadow-primary/20",
                    form.getValues('amount') === tier.amount
                      ? "border-primary bg-primary/5 scale-105 shadow-lg shadow-primary/20"
                      : "border-muted"
                  )}
                  onClick={() => handlePledgeTierSelect(tier.amount)}
                >
                  <span className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                    ${tier.amount}
                  </span>
                  <span className="text-sm font-medium mt-1">{tier.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold">
              ${displayAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              of ${campaign?.funding_goal.toLocaleString()} goal
            </p>
          </div>

          <div className="space-y-2">
            <div className="bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(displayProgress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>{Math.round(displayProgress)}% funded</span>
              <span>{campaign?.pledges?.toLocaleString() || 0} pledges</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-primary font-medium">$</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-8 h-12 text-lg"
                      {...field}
                      onChange={e => {
                        const value = parseFloat(e.target.value);
                        field.onChange(value);
                        setSelectedAmount(value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Or enter a custom amount to pledge to this campaign.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            <Vote className="mr-2 h-4 w-4" />
            Back this Campaign
          </Button>

          <div className="flex items-center gap-2 text-sm">
            <Vote className="h-4 w-4 text-primary" />
            <span>{campaign?.pledges?.toLocaleString() || 0} pledges</span>
          </div>

          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              Please{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => router.push('/login')}
              >
                sign in
              </Button>{' '}
              to join the movement
            </p>
          )}
        </form>
      </Form>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Pledge</DialogTitle>
            <DialogDescription>
              Please review and confirm your pledge amount.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-3xl font-bold">
                ${selectedAmount?.toLocaleString()}
              </span>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                By confirming this pledge, you agree to support this campaign. 
                The funds will be held in escrow until the campaign ends.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmedPledge}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Pledge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}