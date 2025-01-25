'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface ReputationCardProps {
  score?: number;
  successfulCampaigns?: number;
  totalRaised?: number;
  totalBackers?: number;
  achievements?: Achievement[];
}

export function ReputationCard({
  score = 0,
  successfulCampaigns = 0,
  totalRaised = 0,
  totalBackers = 0,
  achievements = [],
}: ReputationCardProps) {
  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'Trophy':
        return <Trophy className="h-4 w-4" />;
      case 'Star':
        return <Star className="h-4 w-4" />;
      case 'Users':
        return <Users className="h-4 w-4" />;
      case 'CheckCircle':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between group">
          <div>
            <CardTitle>Reputation Score</CardTitle>
            <CardDescription>Your standing in the community</CardDescription>
          </div>
          <div className="relative">
            <div className="text-3xl font-bold text-primary transition-transform group-hover:scale-110">
              {score}
            </div>
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-500">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              {successfulCampaigns}
            </div>
            <div className="text-sm text-muted-foreground">
              Successful Campaigns
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              ${totalRaised.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Raised
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              {totalBackers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Backers
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Achievements</h4>
          <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-8 duration-700">
            {achievements.map((achievement) => (
              <TooltipProvider key={achievement.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant={achievement.unlockedAt ? 'default' : 'secondary'} 
                      className={cn(
                        "flex items-center gap-1 transition-all duration-300",
                        achievement.unlockedAt ? "hover:scale-105 hover:shadow-md" : "opacity-50"
                      )}
                    >
                      {getAchievementIcon(achievement.icon)}
                      {achievement.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <p>{achievement.description}</p>
                    {achievement.unlockedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}