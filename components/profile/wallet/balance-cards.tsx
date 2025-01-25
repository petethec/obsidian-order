'use client';

import { getMockWalletData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BalanceCardsProps {
  balance: number;
  pendingBalance: number;
  onAddFunds: () => void;
}

export function BalanceCards({ balance, pendingBalance, onAddFunds }: BalanceCardsProps) {
  // Get the latest wallet data
  const walletData = getMockWalletData();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${walletData.balance.toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Available for withdrawal
            </p>
            <Button size="sm" onClick={onAddFunds}>
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
          <History className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${walletData.pendingBalance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Will be available in 7 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}