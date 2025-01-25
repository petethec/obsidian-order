'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useAuth } from '@/components/auth-provider';
import { createCampaign } from '@/lib/actions/campaigns';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { campaignFormSchema } from '@/lib/validations/campaign';
import { BasicDetails } from './sections/basic-details';
import { MilestoneSection } from './sections/milestone-section';
import { SuccessOutcome } from './sections/success-outcome';
import { FailureOutcome } from './sections/failure-outcome';
import { TypeSpecificFields } from './sections/type-specific-fields';
import { ReviewSection } from './sections/review-section';

interface CampaignFormProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function CampaignForm({ currentStep, onStepChange }: CampaignFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: 'Clean Energy Initiative',
      type: 'government',
      description: 'Support the transition to 100% renewable energy in our city by 2030. This campaign aims to fund solar panel installations on public buildings and create community energy programs.',
      goal: 100000,
      duration: '90',
      target: 'City Council',
      milestones: [
        {
          title: 'Initial Assessment',
          date: '2024-03-01',
          description: 'Complete energy audit of all public buildings and identify priority installation sites.'
        },
        {
          title: 'Community Engagement',
          date: '2024-04-01',
          description: 'Host town halls and gather community input on renewable energy initiatives.'
        },
        {
          title: 'Installation Phase 1',
          date: '2024-05-01',
          description: 'Begin solar panel installation on first batch of public buildings.'
        }
      ],
      successType: 'community',
      successDescription: 'When we reach our goal, we will install solar panels on 10 public buildings and establish a community energy program.',
      failureType: 'refund',
      failureDescription: 'If we don\'t reach our goal, all contributors will receive an 80% refund, with 20% going to fund smaller renewable energy education programs.',
      charityName: '',
      refundPercentage: 80,
      votingEnabled: true,
      votingDuration: 30,
      competitionRules: 'Proposals will be evaluated based on environmental impact and community benefit.',
    },
    mode: 'onChange'
  });

  const isStepValid = () => {
    const currentFields = {
      1: ['title', 'type', 'description', 'goal', 'duration', 'target'],
      2: ['milestones'],
      3: ['successType', 'successDescription', 'failureType', 'failureDescription'],
      4: []
    }[currentStep] || [];

    const isValid = currentFields.every(field => {
      const value = form.getValues(field);
      const fieldState = form.getFieldState(field);
      return value !== undefined && value !== '' && !fieldState.invalid;
    });

    return isValid;
  };

  async function onSubmit(values: z.infer<typeof campaignFormSchema>) {
    if (currentStep < 4) {
      if (isStepValid()) {
        onStepChange(currentStep + 1);
      }
      return;
    }

    try {
      startTransition(async () => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(values.duration));

        const campaign = await createCampaign({
          creator_id: user?.id as string,
          title: values.title,
          description: values.description,
          type: values.type,
          funding_goal: values.goal,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          target: values.target,
          milestones: values.milestones,
          success_type: values.successType === 'other' ? values.customSuccessType : values.successType,
          success_description: values.successDescription,
          failure_type: values.failureType === 'other' ? values.customFailureType : values.failureType,
          failure_description: values.failureDescription,
          charity_name: values.charityName,
          refund_percentage: values.refundPercentage,
          status: 'active',
        });

        toast({
          title: 'Campaign Created',
          description: 'Your campaign has been created successfully.',
        });

        router.push(`/campaigns/${campaign.id}`);
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to create campaign:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {currentStep === 1 && <BasicDetails form={form} />}
        {currentStep === 2 && <MilestoneSection form={form} />}
        {currentStep === 3 && (
          <div className="space-y-8">
            <SuccessOutcome form={form} />
            <FailureOutcome form={form} />
            <TypeSpecificFields form={form} />
          </div>
        )}
        {currentStep === 4 && <ReviewSection form={form} />}

        <div className="flex justify-between space-x-4">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={() => onStepChange(currentStep - 1)}>
              Previous
            </Button>
          )}
          <div className="flex-1" />
          <Button 
            type="submit" 
            disabled={isPending || !isStepValid()}
          >
            {currentStep === 4 ? (isPending ? 'Creating...' : 'Launch Campaign') : 'Continue'}
          </Button>
        </div>
      </form>
    </Form>
  );
}