'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { updateMockWalletBalance } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, CreditCard } from 'lucide-react';

interface AddFundsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankAccounts: Array<{
    id: string;
    bankName: string;
    accountType: string;
    last4: string;
  }>;
  cards: Array<{
    id: string;
    brand: string;
    last4: string;
  }>;
}

export function AddFundsDialog({
  open,
  onOpenChange,
  bankAccounts,
  cards,
}: AddFundsDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach'>('card');

  const handleAddFunds = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update mock wallet balance
      const numAmount = Number(amount);
      updateMockWalletBalance(numAmount);

      toast({
        title: 'Funds Added',
        description: `$${amount} has been added to your balance.`,
      });

      // Refresh the page to show updated balance
      router.refresh();

      onOpenChange(false);
      setAmount('');
      setSelectedCard('');
      setSelectedBank('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add funds',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
          <DialogDescription>
            Add funds to your account using your preferred payment method.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'ach' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setPaymentMethod('ach')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                ACH Transfer
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Payment Source</Label>
            {paymentMethod === 'card' ? (
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map(card => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.brand} •••• {card.last4}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map(bank => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.bankName} •••• {bank.last4} ({bank.accountType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddFunds}
            disabled={
              isLoading || 
              !amount || 
              Number(amount) <= 0 || 
              (!selectedCard && !selectedBank)
            }
          >
            {isLoading ? 'Processing...' : 'Add Funds'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}