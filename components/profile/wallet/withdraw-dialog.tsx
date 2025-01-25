'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, CreditCard } from 'lucide-react';

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: number;
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

export function WithdrawDialog({
  open,
  onOpenChange,
  balance,
  bankAccounts,
  cards,
}: WithdrawDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'card' | 'ach'>('ach');

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Withdrawal Initiated',
        description: `$${withdrawAmount} will be sent to your selected account.`,
      });

      onOpenChange(false);
      setWithdrawAmount('');
      setSelectedCard('');
      setSelectedBank('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process withdrawal',
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
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw and select a destination.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Withdrawal Method</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={withdrawMethod === 'ach' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setWithdrawMethod('ach')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                ACH Transfer
              </Button>
              <Button
                type="button"
                variant={withdrawMethod === 'card' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setWithdrawMethod('card')}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Card
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
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                max={balance}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Available balance: ${balance.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <Label>Destination</Label>
            {withdrawMethod === 'ach' ? (
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
            ) : (
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
            )}
            {withdrawMethod === 'ach' && (
              <p className="text-sm text-muted-foreground mt-2">
                ACH transfers typically take 2-3 business days to process
              </p>
            )}
          </div>
          <Button
            className="w-full"
            onClick={handleWithdraw}
            disabled={isLoading || !withdrawAmount || 
              (withdrawMethod === 'card' && !selectedCard) ||
              (withdrawMethod === 'ach' && !selectedBank) ||
              Number(withdrawAmount) <= 0 || Number(withdrawAmount) > balance}
          >
            {isLoading ? 'Processing...' : 'Withdraw Funds'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}