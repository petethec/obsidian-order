'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, CreditCard, Plus } from 'lucide-react';

interface PaymentMethod {
  id: string;
  isDefault: boolean;
}

interface BankAccount extends PaymentMethod {
  bankName: string;
  accountType: string;
  last4: string;
}

interface CreditCard extends PaymentMethod {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface PaymentMethodsProps {
  bankAccounts: BankAccount[];
  cards: CreditCard[];
  onAddBank: () => void;
  onAddCard: () => void;
  onRemove: (item: { type: 'bank' | 'card'; id: string; name: string }) => void;
}

export function PaymentMethods({
  bankAccounts,
  cards,
  onAddBank,
  onAddCard,
  onRemove,
}: PaymentMethodsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Bank Accounts & Cards</h3>
        <div className="space-x-2">
          <Button size="sm" onClick={onAddBank}>
            <Building2 className="h-4 w-4 mr-2" />
            Add Bank Account
          </Button>
          <Button size="sm" onClick={onAddCard}>
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {bankAccounts.map(bank => (
          <Card key={bank.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-secondary p-2">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">
                    {bank.bankName} •••• {bank.last4}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {bank.accountType} Account
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {bank.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={bank.isDefault}
                  onClick={() => onRemove({
                    type: 'bank',
                    id: bank.id,
                    name: `${bank.bankName} •••• ${bank.last4}`
                  })}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {cards.map(card => (
          <Card key={card.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-secondary p-2">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium capitalize">
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {card.expMonth}/{card.expYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {card.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={card.isDefault}
                  onClick={() => onRemove({
                    type: 'card',
                    id: card.id,
                    name: `${card.brand} •••• ${card.last4}`
                  })}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}