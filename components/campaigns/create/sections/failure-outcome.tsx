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
import { CircleDollarSign, Heart, AlertTriangle, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface FailureOutcomeProps {
  form: UseFormReturn<any>;
}

export function FailureOutcome({ form }: FailureOutcomeProps) {
  const [failureType, setFailureType] = useState('refund');

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="failureType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Failure Outcome Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  setFailureType(value);
                }}
                defaultValue={field.value}
                className="grid grid-cols-4 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="refund" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <CircleDollarSign className="mb-2 h-6 w-6" />
                    <div className="text-center">Partial Refund</div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="charity" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <Heart className="mb-2 h-6 w-6" />
                    <div className="text-center">Charity Redirect</div>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="challenge" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                    <AlertTriangle className="mb-2 h-6 w-6" />
                    <div className="text-center">Creator Challenge</div>
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
              Choose what happens if the campaign doesn't reach its goal.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {failureType === 'other' && (
        <FormField
          control={form.control}
          name="customFailureType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Failure Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your custom failure type"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe your custom failure outcome type
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {failureType === 'refund' && (
        <FormField
          control={form.control}
          name="refundPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refund Percentage</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="80"
                    min="0"
                    max="100"
                    required
                    className="pl-10"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-2">%</span>
                </div>
              </FormControl>
              <FormDescription>
                Percentage of contributions to be refunded if the campaign fails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {failureType === 'charity' && (
        <FormField
          control={form.control}
          name="charityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Charity Organization</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter charity name"
                  required
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Specify the charity that will receive the funds if the campaign fails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="failureDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Failure Outcome Details</FormLabel>
            <FormDescription>
              Describe what happens if milestones are missed or the campaign fails.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Describe what happens if the campaign fails..."
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