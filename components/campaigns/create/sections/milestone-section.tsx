'use client';

import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';

interface MilestoneSectionProps {
  form: UseFormReturn<any>;
}

export function MilestoneSection({ form }: MilestoneSectionProps) {
  const [milestones, setMilestones] = useState([{ date: '', description: '', title: '' }]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Campaign Milestones</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMilestones([...milestones, { date: '', description: '', title: '' }])}
        >
          Add Milestone
        </Button>
      </div>
      {milestones.map((_, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          <FormField
            control={form.control}
            name={`milestones.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Milestone Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter milestone title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`milestones.${index}.date`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`milestones.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what needs to be achieved..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {index > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => {
                const newMilestones = [...milestones];
                newMilestones.splice(index, 1);
                setMilestones(newMilestones);
              }}
            >
              Remove Milestone
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}