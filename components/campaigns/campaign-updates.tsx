'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageCircle, ThumbsUp } from 'lucide-react';

interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'milestone' | 'general' | 'important';
  likes: number;
  comments: number;
}

interface CampaignUpdatesProps {
  updates: Update[];
}

export function CampaignUpdates({ updates }: CampaignUpdatesProps) {
  const [expandedUpdates, setExpandedUpdates] = useState<string[]>([]);

  const toggleUpdate = (id: string) => {
    setExpandedUpdates(prev => 
      prev.includes(id) 
        ? prev.filter(updateId => updateId !== id)
        : [...prev, id]
    );
  };

  const getUpdateBadge = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Badge className="bg-primary">Milestone</Badge>;
      case 'important':
        return <Badge variant="destructive">Important</Badge>;
      default:
        return <Badge variant="secondary">Update</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Updates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {updates.map((update) => (
          <div
            key={update.id}
            className="border rounded-lg p-4 space-y-4 transition-all duration-300 hover:border-primary"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getUpdateBadge(update.type)}
                  <h4 className="font-medium">{update.title}</h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(update.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className={`space-y-4 ${
              expandedUpdates.includes(update.id) ? '' : 'line-clamp-3'
            }`}>
              <p className="text-sm text-muted-foreground">{update.content}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{update.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{update.comments}</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleUpdate(update.id)}
              >
                {expandedUpdates.includes(update.id) ? 'Show Less' : 'Read More'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}