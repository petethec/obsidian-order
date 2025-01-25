'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { StatsOverview } from '@/components/profile/stats-overview';
import { ProfileForm } from '@/components/profile/profile-form';
import { ProfileUpdateForm } from '@/components/profile/profile-update-form';
import { BalanceCards } from '@/components/profile/wallet/balance-cards';
import { PaymentMethods } from '@/components/profile/wallet/payment-methods';
import { CampaignList } from '@/components/profile/campaigns/campaign-list';
import { History, Wallet } from 'lucide-react';
import { WithdrawDialog } from '@/components/profile/wallet/withdraw-dialog';
import { AddBankDialog } from '@/components/profile/wallet/add-bank-dialog';
import { AddCardDialog } from '@/components/profile/wallet/add-card-dialog';
import { AddFundsDialog } from '@/components/profile/wallet/add-funds-dialog';
import { RemovePaymentDialog } from '@/components/profile/wallet/remove-payment-dialog';
import { TransactionHistoryDialog } from '@/components/profile/wallet/transaction-history-dialog';

// Mock data imports
import {
  mockProfile,
  mockStats,
  mockWalletData,
  mockCampaigns,
} from '@/lib/mock-data';

export default function ProfilePage() {
  const { toast } = useToast();
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showAddBankDialog, setShowAddBankDialog] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<{
    type: 'card' | 'bank';
    id: string;
    name: string;
  } | null>(null);

  const handleRemovePaymentMethod = (item: {
    type: 'card' | 'bank';
    id: string;
    name: string;
  }) => {
    setItemToRemove(item);
    setShowRemoveDialog(true);
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <StatsOverview stats={mockStats} />

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your profile information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="space-y-6">
                  <ProfileForm initialData={mockProfile} />
                  <ProfileUpdateForm initialData={{
                    full_name: mockProfile.full_name || '',
                    email: mockProfile.email || ''
                  }} />
                </div>
              </TabsContent>

              <TabsContent value="wallet">
                <div className="space-y-6">
                  <BalanceCards
                    balance={mockWalletData.balance}
                    pendingBalance={mockWalletData.pendingBalance}
                    onAddFunds={() => setShowAddFundsDialog(true)}
                  />

                  <PaymentMethods
                    bankAccounts={mockWalletData.bankAccounts}
                    cards={mockWalletData.cards}
                    onAddBank={() => setShowAddBankDialog(true)}
                    onAddCard={() => setShowAddCardDialog(true)}
                    onRemove={handleRemovePaymentMethod}
                  />

                  <div className="flex space-x-4">
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => setShowWithdrawDialog(true)}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                    <Button 
                      className="flex-1" 
                      variant="outline"
                      onClick={() => setShowTransactionHistory(true)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      Transaction History
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="campaigns">
                <CampaignList campaigns={mockCampaigns} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <WithdrawDialog
          open={showWithdrawDialog}
          onOpenChange={setShowWithdrawDialog}
          balance={mockWalletData.balance}
          bankAccounts={mockWalletData.bankAccounts}
          cards={mockWalletData.cards}
        />

        <AddBankDialog
          open={showAddBankDialog}
          onOpenChange={setShowAddBankDialog}
        />

        <AddCardDialog
          open={showAddCardDialog}
          onOpenChange={setShowAddCardDialog}
        />

        <RemovePaymentDialog
          open={showRemoveDialog}
          onOpenChange={setShowRemoveDialog}
          item={itemToRemove}
        />

        <TransactionHistoryDialog
          open={showTransactionHistory}
          onOpenChange={setShowTransactionHistory}
        />

        <AddFundsDialog
          open={showAddFundsDialog}
          onOpenChange={setShowAddFundsDialog}
          bankAccounts={mockWalletData.bankAccounts}
          cards={mockWalletData.cards}
        />
      </div>
    </div>
  );
}