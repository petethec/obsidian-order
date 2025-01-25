'use client';

import { useState, useEffect } from 'react';
import { getConsequenceStatus } from '@/lib/actions/consequences';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ConsequenceStatusProps {
  campaignId: string;
  type?: 'success' | 'failure';
}

export function ConsequenceStatus({ campaignId, type = 'success' }: ConsequenceStatusProps) {
  const [status, setStatus] = useState<string>('loading');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getConsequenceStatus(campaignId);
        setStatus(result.status);
        setLastUpdated(result.last_updated);
      } catch (error) {
        console.error('Failed to fetch consequence status:', error);
        setStatus('error');
      }
    };

    fetchStatus();
  }, [campaignId]);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">
          Loading status...
        </span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Badge variant="destructive">
        <AlertTriangle className="h-4 w-4 mr-1" />
        Error loading status
      </Badge>
    );
  }

  return (
    <div className="space-y-2">
      <Badge
        className={cn(
          "consequence-indicator px-4 py-2 font-medium text-base flex items-center gap-2",
          status === 'approved' ? "bg-primary text-primary-foreground scale-105" :
          status === 'rejected' ? "bg-destructive text-destructive-foreground scale-105" :
          "bg-secondary text-secondary-foreground scale-100"
        )}
      >
        {status === 'approved' && <CheckCircle className="h-4 w-4" />}
        {status === 'rejected' && <AlertTriangle className="h-4 w-4" />}
        {status === 'pending' && <Clock className="h-4 w-4" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Last updated: {new Date(lastUpdated).toLocaleString()}
      </p>
    </div>
  );
}