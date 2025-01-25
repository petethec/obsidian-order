'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpToLine, ArrowDownToLine, Calendar } from 'lucide-react';

// Import mock data (you should replace this with real data fetching)
import { mockTransactions } from '@/lib/mock-data';

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionHistoryDialog({
  open,
  onOpenChange,
}: TransactionHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
          <DialogDescription>
            View your recent transactions and their status.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto pr-2 max-h-[60vh]">
          {mockTransactions.map(transaction => (
            <Card key={transaction.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full p-2 ${
                    transaction.type === 'withdrawal' 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {transaction.type === 'withdrawal' 
                      ? <ArrowUpToLine className="h-4 w-4" />
                      : <ArrowDownToLine className="h-4 w-4" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'withdrawal' ? 'text-destructive' : 'text-primary'
                  }`}>
                    {transaction.type === 'withdrawal' ? '-' : '+'}
                    ${transaction.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}