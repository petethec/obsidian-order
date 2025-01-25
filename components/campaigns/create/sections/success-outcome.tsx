'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Gift, Target, Heart, Sparkles } from 'lucide-react';

interface SuccessOutcomeProps {
  form: UseFormReturn<any>;
}

export function SuccessOutcome({ form }: SuccessOutcomeProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="successType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Success Outcome Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-4 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="reward" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Gift className="mb-2 h-6 w-6" />
                    <div className="text-center">Reward Fulfillment</div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="stretch" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Target className="mb-2 h-6 w-6" />
                    <div className="text-center">Stretch Goals</div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="community" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Heart className="mb-2 h-6 w-6" />
                    <div className="text-center">Community Impact</div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="other" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Sparkles className="mb-2 h-6 w-6" />
                    <div className="text-center">Custom Type</div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Select how you'll deliver value upon successful funding.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('successType') === 'other' && (
        <FormField
          control={form.control}
          name="customSuccessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Success Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your custom success type"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe your custom success outcome type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="successDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Success Outcome Details</FormLabel>
            <FormDescription>
              Describe what happens when all milestones are met and the campaign succeeds.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Describe what happens when the campaign succeeds..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}