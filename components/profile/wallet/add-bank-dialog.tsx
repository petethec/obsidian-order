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

interface AddBankDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBankDialog({ open, onOpenChange }: AddBankDialogProps) {
  const { toast } = useToast();
  const [newBankAccount, setNewBankAccount] = useState({
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    accountHolderName: '',
  });

  const handleAddBank = () => {
    toast({
      title: 'Bank Account Added',
      description: 'Your bank account has been successfully added.',
    });
    onOpenChange(false);
    setNewBankAccount({
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking',
      accountHolderName: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>
            Enter your bank account details for ACH transfers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Account Holder Name</Label>
            <Input
              placeholder="John Doe"
              value={newBankAccount.accountHolderName}
              onChange={(e) => setNewBankAccount({
                ...newBankAccount,
                accountHolderName: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Routing Number</Label>
            <Input
              placeholder="123456789"
              value={newBankAccount.routingNumber}
              onChange={(e) => setNewBankAccount({
                ...newBankAccount,
                routingNumber: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              type="password"
              placeholder="Enter account number"
              value={newBankAccount.accountNumber}
              onChange={(e) => setNewBankAccount({
                ...newBankAccount,
                accountNumber: e.target.value
              })}
            />
          </div>
          <div className="space-y-2">
            <Label>Account Type</Label>
            <Select
              value={newBankAccount.accountType}
              onValueChange={(value) => setNewBankAccount({
                ...newBankAccount,
                accountType: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={handleAddBank}
            disabled={
              !newBankAccount.accountNumber ||
              !newBankAccount.routingNumber ||
              !newBankAccount.accountHolderName
            }
          >
            Add Bank Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}