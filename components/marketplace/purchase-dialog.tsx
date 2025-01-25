'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, CircleDollarSign, Handshake, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface PurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: {
    id: string;
    price: number;
    campaign: {
      title: string;
    };
    legacy_share_enabled: boolean;
    legacy_share_discount: number;
    royalty_percentage: number;
    royalty_duration_months: number;
    advisor_role_enabled: boolean;
    advisor_engagement_level?: string;
  };
  legacyShare: {
    enabled: boolean;
    discount: number;
    royalty: number;
    duration: number;
  };
  advisorRole: {
    enabled: boolean;
    level: string;
  };
}

export function PurchaseDialog({
  open,
  onOpenChange,
  listing,
  legacyShare,
  advisorRole,
}: PurchaseDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const finalPrice = legacyShare.enabled
    ? listing.price * (1 - legacyShare.discount / 100)
    : listing.price;

  const steps = [
    { title: 'Review Terms', icon: AlertTriangle },
    { title: 'Confirm Details', icon: Handshake },
    { title: 'Complete Purchase', icon: Sparkles }
  ];

  const handlePurchase = async () => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setShowConfetti(true);
      toast({
        title: 'Purchase Successful',
        description: 'Welcome to your new campaign! Your legacy journey begins.',
      });

      // Give time for confetti animation
      setTimeout(() => {
        router.push('/marketplace/agreements');
      }, 2000);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete purchase. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setShowConfetti(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Add confetti animation here */}
          </div>
        )}

        <DialogHeader>
          <DialogTitle>Purchase Campaign</DialogTitle>
          <DialogDescription>
            Review and confirm your campaign purchase
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {steps.map((s, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col items-center gap-2",
                  step > i ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                  step > i ? "border-primary" : "border-muted"
                )}>
                  {s.icon && <s.icon className="h-4 w-4" />}
                </div>
                <span className="text-xs font-medium">{s.title}</span>
              </div>
            ))}
          </div>
          <Progress 
            value={(step / steps.length) * 100} 
            className="h-1" />
        </div>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-medium mb-2">{listing.campaign.title}</h3>
            <div className="flex items-center justify-between text-2xl font-bold">
              <CircleDollarSign className="h-6 w-6 text-muted-foreground" />
              <div className="text-right">
                <span className="text-2xl">${finalPrice.toLocaleString()}</span>
                {legacyShare.enabled && <div className="text-sm text-primary">Legacy Share Enabled</div>}
              </div>
            </div>
            {legacyShare.enabled && (
              <p className="text-sm text-muted-foreground text-right mt-1">
                {legacyShare.discount}% legacy share discount applied
              </p>
            )}
          </div>

          {step === 1 && legacyShare.enabled && (
            <Alert>
              <AlertTitle>Legacy Share Terms</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  You agree to share {legacyShare.royalty}% of campaign revenue
                  with the seller for {legacyShare.duration} months.
                </p>
                <p className="text-sm text-muted-foreground">
                  This agreement will be enforced through a smart contract.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {advisorRole.enabled && (
            <Alert>
              <AlertTitle>Advisory Agreement</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  The seller will provide {advisorRole.level} level advisory
                  support ({listing.advisor_engagement_level} engagement).
                </p>
                <p className="text-sm text-muted-foreground">
                  Terms and conditions apply to the advisory relationship.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => 
                    setTermsAccepted(checked as boolean)
                  }
                />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the terms of sale and transfer of ownership
                </Label>
              </div>
              
              <Alert variant="default" className="bg-primary/5 border-primary/10">
                <AlertTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Legacy Benefits
                </AlertTitle>
                <AlertDescription className="mt-2 space-y-2">
                  <p>• Immediate access to campaign assets and data</p>
                  <p>• Seller advisory support for smooth transition</p>
                  <p>• Automatic transfer of backer relationships</p>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={isSubmitting}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={step < 3 ? () => setStep(step + 1) : handlePurchase}
              disabled={isSubmitting || (step === 2 && !termsAccepted)}
            >
              {isSubmitting ? 'Processing...' : 'Complete Purchase'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}