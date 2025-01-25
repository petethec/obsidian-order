'use client'
import { useState, useEffect } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LegacyShareCalculator } from '@/components/marketplace/legacy-share-calculator';
import { AdvisorRoleCard } from '@/components/marketplace/advisor-role-card';
import { GlassScoreCard } from '@/components/marketplace/glass-score-card';
import { mockGlassScores } from '@/lib/mock-data/marketplace';
import { CircleDollarSign, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  price: z.number()
    .min(1000, 'Price must be at least $1,000')
    .max(1000000, 'Price cannot exceed $1,000,000')
    .refine(val => Number.isInteger(val), 'Price must be a whole number'),
  summary: z.string()
    .min(100, 'Summary must be at least 100 characters')
    .max(2000, 'Summary cannot exceed 2000 characters')
    .refine(val => /^[a-zA-Z0-9\s.,!?-]+$/.test(val), 'Summary contains invalid characters'),
  performance_details: z.string()
    .min(50, 'Performance details must be at least 50 characters')
    .max(1000, 'Performance details cannot exceed 1000 characters')
    .refine(
      val => !val.includes('http') && !val.includes('www'),
      'Links are not allowed in performance details'
    ),
  buyer_requirements: z.string()
    .max(500, 'Buyer requirements cannot exceed 500 characters')
    .optional()
    .refine(
      val => !val || /^[a-zA-Z0-9\s.,!?-]+$/.test(val),
      'Buyer requirements contain invalid characters'
    ),
});

export default function SellPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState({
    price: undefined,
    summary: '',
    performance_details: '',
  });
  const [legacyShare, setLegacyShare] = useState({
    enabled: false,
    discount: 10,
    royalty: 15,
    duration: 24,
  });
  const [advisorRole, setAdvisorRole] = useState({
    enabled: false,
    level: 'moderate' as const,
  });

  // Mock campaign data - moved outside of component for static analysis
  const campaign = {
    id: 'clean-energy' as CampaignId,
    title: 'Clean Energy Initiative',
    current_amount: 75000,
    funding_goal: 100000,
    backer_count: 1234,
  };

  const glassScore = mockGlassScores[campaign.id] || null;
  const isEligible = glassScore?.score >= 75;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: 0,
      summary: '',
      performance_details: '',
      buyer_requirements: '',
    },
  });

  // Watch form values to determine validity
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value);
      const isValid = !!(
        value.price &&
        value.summary?.length >= 100 &&
        value.performance_details?.length >= 50
      );
      setFormValid(isValid);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Update button state based on form validity
  useEffect(() => {
    const isValid = !!(
      formData.price &&
      formData.summary?.length >= 100 &&
      formData.performance_details?.length >= 50
    );
    setFormValid(isValid);
  }, [formData]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // For static export, simulate API call with local storage
      const listings = JSON.parse(localStorage.getItem('marketplace_listings') || '[]');
      const newListing = {
        id: `listing_${Date.now()}`,
        ...values,
        legacyShare,
        advisorRole,
        created_at: new Date().toISOString(),
      };
      listings.push(newListing);
      localStorage.setItem('marketplace_listings', JSON.stringify(listings));

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/marketplace/listings');
    } catch (error) {
      console.error('Failed to create listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Error boundary fallback
  if (!glassScore) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="py-10">
            <div className="text-center space-y-2">
              <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
              <h2 className="text-2xl font-bold">Error Loading Data</h2>
              <p className="text-muted-foreground">
                Unable to load campaign data. Please try again later.
              </p>
              <Button 
                variant="outline" 
                onClick={() => router.push('/marketplace')}
                className="mt-4"
              >
                Return to Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sell Your Campaign</h1>
            <p className="text-muted-foreground">
              List your successful campaign on the marketplace
            </p>
          </div>

          <Progress value={(step / 3) * 100} className="h-2" />

          {!isEligible ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Not Eligible</AlertTitle>
              <AlertDescription>
                Your campaign needs a GlassScore of at least 75 to be listed.
                Current score: {glassScore.score}
              </AlertDescription>
            </Alert>
          ) : (
            <Tabs value={String(step)} onValueChange={(v) => setStep(Number(v))}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="1">Eligibility</TabsTrigger>
                <TabsTrigger value="2">Listing Details</TabsTrigger>
                <TabsTrigger value="3">Legacy Options</TabsTrigger>
              </TabsList>

              <TabsContent value="1">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Eligibility</CardTitle>
                    <CardDescription>
                      Review your campaign's performance and eligibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-semibold mb-2">{campaign.title}</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Raised</dt>
                            <dd className="font-medium">
                              ${campaign.current_amount.toLocaleString()}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Goal</dt>
                            <dd className="font-medium">
                              ${campaign.funding_goal.toLocaleString()}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Backers</dt>
                            <dd className="font-medium">
                              {campaign.backer_count.toLocaleString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <GlassScoreCard
                        score={glassScore.score}
                        details={glassScore.details}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => setStep(2)}
                    >
                      Continue to Listing Details
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="2">
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Details</CardTitle>
                    <CardDescription>
                      Set your price and provide details for potential buyers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-6">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Listing Price</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <CircleDollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    className="pl-10"
                                    value={field.value || ''}
                                    min={1000}
                                    max={1000000}
                                    step={1}
                                    onChange={e => {
                                      const value = e.target.value === '' ? 0 : Number(e.target.value);
                                      field.onChange(value);
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Set a price between $1,000 and $1,000,000
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="summary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Campaign Summary</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your campaign's mission, achievements, and potential..."
                                  className="min-h-[100px]"
                                  value={field.value || ''}
                                  onChange={e => field.onChange(e.target.value)}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value?.length || 0}/2000 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="performance_details"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Performance Details</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Share key metrics, growth rate, and other success indicators..."
                                  className="min-h-[100px]"
                                  value={field.value || ''}
                                  onChange={e => field.onChange(e.target.value)}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value?.length || 0}/1000 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="button"
                          className="w-full"
                          onClick={() => setStep(3)}
                          disabled={!formValid}
                        >
                          Continue to Legacy Options
                        </Button>
                        {!formValid && (
                          <p className="text-sm text-destructive text-center mt-2">
                            Please complete all required fields correctly
                          </p>
                        )}
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="3">
                <div className="space-y-6">
                  <LegacyShareCalculator
                    listingPrice={form.getValues('price')}
                    onChange={setLegacyShare}
                  />

                  <AdvisorRoleCard
                    enabled={advisorRole.enabled}
                    level={advisorRole.level}
                    onEnableChange={(enabled) => 
                      setAdvisorRole(prev => ({ ...prev, enabled }))
                    }
                    onLevelChange={(level) => 
                      setAdvisorRole(prev => ({ ...prev, level }))
                    }
                  />

                  <Card>
                    <CardContent className="pt-6">
                      <Button
                        className="w-full"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting || !form.formState.isValid}
                      >
                        {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
                      </Button>
                      {!form.formState.isValid && (
                        <p className="text-sm text-destructive text-center mt-2">
                          Please complete all required fields correctly
                        </p>
                      )}
                      <p className="mt-2 text-center text-sm text-muted-foreground">
                        A listing fee of $100 will be charged upon submission
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}