import * as z from 'zod';

export const campaignFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum([
    'corporate_advocacy',
    'refundable_milestone', 
    'competitive_innovation',
    'government',
    'innovation',
    'fail_forward'
  ], {
    required_error: 'Please select a campaign type'
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  goal: z.number().or(z.undefined()).transform(val => {
    if (val === undefined) return undefined;
    return Number(val);
  }).pipe(z.number({
    required_error: 'Funding goal is required',
    invalid_type_error: 'Funding goal must be a number'
  }).min(1, 'Goal must be greater than 0')),
  duration: z.string({
    required_error: 'Duration is required'
  }),
  target: z.string().min(1, 'Target is required'),
  milestones: z.array(z.object({
    date: z.string().min(1, 'Date is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    title: z.string().min(1, 'Title is required')
  })).min(1, 'At least one milestone is required'),
  successType: z.enum(['reward', 'stretch', 'community', 'other'], {
    required_error: 'Please select a success outcome type'
  }),
  customSuccessType: z.string().optional(),
  successDescription: z.string().min(20, 'Success description must be at least 20 characters'),
  failureType: z.enum(['refund', 'charity', 'challenge', 'other'], {
    required_error: 'Please select a failure outcome type'
  }),
  customFailureType: z.string().optional(),
  failureDescription: z.string().min(20, 'Failure description must be at least 20 characters'),
  charityName: z.string().optional(),
  refundPercentage: z.number().min(0).max(100).optional(),
  votingEnabled: z.boolean().optional(),
  votingDuration: z.number().min(1).optional(),
  minimumPledge: z.number().min(0).optional(),
  competitionRules: z.string().optional(),
  corporateTarget: z.object({
    name: z.string(),
    position: z.string(),
    department: z.string(),
  }).optional(),
});