'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign, Target, History, User } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    total: number;
    active: number;
    successful: number;
    totalRaised: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4 animate-in fade-in-50 duration-500">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            {stats.total}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            {stats.active}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group">
          <CardTitle className="text-sm font-medium">Successful</CardTitle>
          <History className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            {stats.successful}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 group">
          <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
          <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            ${stats.totalRaised.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}