'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Twitter, Facebook, Linkedin } from 'lucide-react';

interface ShareCardProps {
  campaignId: string;
  title: string;
  description: string;
}

export function ShareCard({ campaignId, title, description }: ShareCardProps) {
  const { toast } = useToast();
  const [customMessage, setCustomMessage] = useState(
    `Support this campaign: ${title}\n\n${description}`
  );

  const shareUrl = `${window.location.origin}/campaigns/${campaignId}`;
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(customMessage)}&url=${encodeURIComponent(shareUrl)}&hashtags=ImpactCampaign,SocialChange`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(customMessage)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Link Copied',
        description: 'Campaign link has been copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Campaign
        </CardTitle>
        <CardDescription>
          Help spread the word and increase our impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Customize Message</label>
          <Input
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="h-24"
            maxLength={280}
          />
          <p className="text-xs text-muted-foreground text-right">
            {customMessage.length}/280 characters
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(shareLinks.twitter, '_blank')}
          >
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(shareLinks.facebook, '_blank')}
          >
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(shareLinks.linkedin, '_blank')}
          >
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}