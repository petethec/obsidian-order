'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AdvisorRoleCardProps {
  enabled: boolean;
  level?: 'light' | 'moderate' | 'active';
  onEnableChange?: (enabled: boolean) => void;
  onLevelChange?: (level: 'light' | 'moderate' | 'active') => void;
}

const ENGAGEMENT_LEVELS = {
  light: {
    hours: '1-2',
    description: 'Monthly check-ins and emergency support',
  },
  moderate: {
    hours: '5-10',
    description: 'Bi-weekly meetings and strategic guidance',
  },
  active: {
    hours: '10-20',
    description: 'Weekly involvement and hands-on support',
  },
};

export function AdvisorRoleCard({
  enabled,
  level = 'moderate',
  onEnableChange,
  onLevelChange,
}: AdvisorRoleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle>Advisor Role</CardTitle>
              <CardDescription>
                Provide guidance to the new owner
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    As an advisor, you'll help ensure a smooth transition and
                    continued success of the campaign under new ownership.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onEnableChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {enabled && (
          <RadioGroup
            value={level}
            onValueChange={(value) => 
              onLevelChange?.(value as 'light' | 'moderate' | 'active')
            }
            className="grid gap-4"
          >
            {Object.entries(ENGAGEMENT_LEVELS).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={key} />
                <Label
                  htmlFor={key}
                  className="flex flex-col cursor-pointer"
                >
                  <span className="font-medium capitalize">
                    {key} ({value.hours} hours/month)
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {value.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}