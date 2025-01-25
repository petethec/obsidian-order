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

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCardDialog({ open, onOpenChange }: AddCardDialogProps) {
  const { toast } = useToast();
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
  });

  const handleAddCard = () => {
    toast({
      title: 'Card Added',
      description: 'Your card has been successfully added.',
    });
    onOpenChange(false);
    setNewCard({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
          <DialogDescription>
            Enter your card details for payments and withdrawals.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Cardholder Name</Label>
            <Input
              placeholder="John Doe"
              value={newCard.cardholderName}
              onChange={(e) => setNewCard({
                ...newCard,
                cardholderName: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Card Number</Label>
            <Input
              placeholder="1234 5678 9012 3456"
              value={newCard.cardNumber}
              onChange={(e) => setNewCard({
                ...newCard,
                cardNumber: e.target.value
              })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Expiry Month</Label>
              <Input
                placeholder="MM"
                maxLength={2}
                value={newCard.expiryMonth}
                onChange={(e) => setNewCard({
                  ...newCard,
                  expiryMonth: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Expiry Year</Label>
              <Input
                placeholder="YY"
                maxLength={2}
                value={newCard.expiryYear}
                onChange={(e) => setNewCard({
                  ...newCard,
                  expiryYear: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>CVV</Label>
              <Input
                type="password"
                placeholder="123"
                maxLength={4}
                value={newCard.cvv}
                onChange={(e) => setNewCard({
                  ...newCard,
                  cvv: e.target.value
                })}
              />
            </div>
          </div>
          <Button
            className="w-full"
            onClick={handleAddCard}
            disabled={
              !newCard.cardNumber ||
              !newCard.expiryMonth ||
              !newCard.expiryYear ||
              !newCard.cvv ||
              !newCard.cardholderName
            }
          >
            Add Card
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}