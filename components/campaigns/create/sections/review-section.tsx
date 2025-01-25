'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleDollarSign, Target, Calendar, AlertTriangle } from 'lucide-react';

interface ReviewSectionProps {
  form: UseFormReturn<any>;
}

export function ReviewSection({ form }: ReviewSectionProps) {
  const values = form.getValues();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>Review your campaign details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Title</div>
              <div className="text-muted-foreground">{values.title}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Type</div>
              <div className="text-muted-foreground capitalize">
                {values.type?.replace('_', ' ')}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm font-medium">Description</div>
              <div className="text-muted-foreground">{values.description}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Funding Goal</div>
              <div className="text-muted-foreground">${values.goal.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Duration</div>
              <div className="text-muted-foreground">{values.duration} days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
          <CardDescription>Campaign progress checkpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {values.milestones.map((milestone: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="font-medium">{milestone.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {milestone.description}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Target Date: {new Date(milestone.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outcomes</CardTitle>
          <CardDescription>Success and failure scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-sm font-medium mb-2">Success Outcome</div>
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="font-medium capitalize mb-1">
                {values.successType} Type
              </div>
              <div className="text-sm text-muted-foreground">
                {values.successDescription}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Failure Outcome</div>
            <div className="bg-destructive/5 rounded-lg p-4">
              <div className="font-medium capitalize mb-1">
                {values.failureType} Type
              </div>
              <div className="text-sm text-muted-foreground">
                {values.failureDescription}
              </div>
              {values.failureType === 'refund' && (
                <div className="text-sm text-muted-foreground mt-2">
                  Refund Percentage: {values.refundPercentage}%
                </div>
              )}
              {values.failureType === 'charity' && values.charityName && (
                <div className="text-sm text-muted-foreground mt-2">
                  Charity: {values.charityName}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}