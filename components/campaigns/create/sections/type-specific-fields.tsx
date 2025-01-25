'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CircleDollarSign } from 'lucide-react';

interface TypeSpecificFieldsProps {
  form: UseFormReturn<any>;
}

export function TypeSpecificFields({ form }: TypeSpecificFieldsProps) {
  const campaignType = form.watch('type');

  if (!campaignType) return null;

  return (
    <div className="space-y-6">
      {campaignType === 'competitive_innovation' && (
        <>
          <FormField
            control={form.control}
            name="votingEnabled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enable Voting</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Allow backers to vote on competing solutions
                </FormDescription>
              </FormItem>
            )}
          />
          
          {form.watch('votingEnabled') && (
            <FormField
              control={form.control}
              name="votingDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voting Duration (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="competitionRules"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competition Rules</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Define the rules and criteria for the competition..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}

      {campaignType === 'corporate_advocacy' && (
        <>
          <FormField
            control={form.control}
            name="corporateTarget.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Executive Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Smith" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="corporateTarget.position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Executive Position</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. CEO" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="corporateTarget.department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department/Division</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Executive Office" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}

      {campaignType === 'refundable_milestone' && (
        <FormField
          control={form.control}
          name="minimumPledge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Pledge Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <CircleDollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-10"
                    placeholder="0"
                    min="0"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Set a minimum pledge amount to participate in refunds
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}