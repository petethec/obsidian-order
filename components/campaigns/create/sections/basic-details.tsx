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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CircleDollarSign, Calendar, Target } from 'lucide-react';

interface BasicDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicDetails({ form }: BasicDetailsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Campaign Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter campaign title" 
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Choose a clear, compelling title that describes your campaign&apos;s goal.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Campaign Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="corporate_advocacy">
                  <div className="flex flex-col">
                    <span>Corporate Advocacy</span>
                    <span className="text-xs text-muted-foreground">
                      Challenge corporations to make specific changes
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="refundable_milestone">
                  <div className="flex flex-col">
                    <span>Refundable Milestone</span>
                    <span className="text-xs text-muted-foreground">
                      Guarantee accountability through refunds
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="competitive_innovation">
                  <div className="flex flex-col">
                    <span>Competitive Innovation</span>
                    <span className="text-xs text-muted-foreground">
                      Drive innovation through competition
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="government">
                  <div className="flex flex-col">
                    <span>Government Action</span>
                    <span className="text-xs text-muted-foreground">
                      Influence government policy/action
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="fail_forward">
                  <div className="flex flex-col">
                    <span>Fail Forward Fund</span>
                    <span className="text-xs text-muted-foreground">
                      Ensure positive impact even in failure
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the type of change you want to drive. Each type has different success criteria and accountability mechanisms.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Campaign Description</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Textarea
                  placeholder="Describe your campaign's goals, impact, and how it will create change..."
                  {...field}
                  className="min-h-[150px]"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {field.value?.length || 0}/2000 characters
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Provide a detailed description of your campaign&apos;s objectives and how it will create change.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <FormField
          control={form.control}
          name="goal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Funding Goal (USD)</FormLabel>
              <FormControl>
                <div className="relative">
                  <CircleDollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="number" 
                    className="pl-10" 
                    placeholder="10000" 
                    value={field.value || ''}
                    onChange={e => {
                      const value = e.target.value === '' ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (Days)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Entity</FormLabel>
              <FormControl>
                <div className="relative">
                  <Target className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input className="pl-10" placeholder="Target name" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}