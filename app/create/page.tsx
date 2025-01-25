'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CampaignForm } from '@/components/campaigns/create/campaign-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Target, AlertTriangle, CheckCircle } from 'lucide-react';

export default function CreateCampaign() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const steps = [
    { title: 'Basic Details', icon: FileText },
    { title: 'Milestones & Goals', icon: Target },
    { title: 'Outcomes', icon: AlertTriangle },
    { title: 'Review', icon: CheckCircle }
  ];

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Your Campaign</h1>
            <p className="text-muted-foreground">
              Launch a consequence-based campaign to drive meaningful change through collective action.
            </p>
          </div>

          <Progress value={(step / steps.length) * 100} className="h-2" />

          <Card>
            <CardHeader>
              <div className="flex justify-between mb-2">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-2 ${
                      step > i ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      step > i ? "border-primary" : "border-muted"
                    }`}>
                      {s.icon && <s.icon className="h-4 w-4" />}
                    </div>
                    <span className="text-xs font-medium">{s.title}</span>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <CampaignForm currentStep={step} onStepChange={setStep} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}