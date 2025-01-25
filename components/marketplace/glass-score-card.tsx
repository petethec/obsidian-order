'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface GlassScoreCardProps {
  score: number;
  details: Array<{
    name: string;
    score: number;
    weight: number;
  }>;
}

export function GlassScoreCard({ score, details }: GlassScoreCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>GlassScore™</CardTitle>
            <CardDescription>Campaign trust metric</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold">{score}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {details.map((detail) => (
            <div key={detail.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{detail.name}</span>
                <span className="font-medium">{detail.score}/100</span>
              </div>
              <Progress value={detail.score} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {detail.weight}% weight
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}