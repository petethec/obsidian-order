'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CircleDollarSign, Clock, Percent } from 'lucide-react';

interface LegacyShareCalculatorProps {
  listingPrice: number;
  onChange?: (values: {
    enabled: boolean;
    discount: number;
    royalty: number;
    duration: number;
  }) => void;
}

export function LegacyShareCalculator({ 
  listingPrice,
  onChange 
}: LegacyShareCalculatorProps) {
  const [enabled, setEnabled] = useState(false);
  const [discount, setDiscount] = useState(10);
  const [royalty, setRoyalty] = useState(15);
  const [duration, setDuration] = useState(24);

  const handleChange = (values: Partial<{
    enabled: boolean;
    discount: number;
    royalty: number;
    duration: number;
  }>) => {
    const newValues = {
      enabled: values.enabled ?? enabled,
      discount: values.discount ?? discount,
      royalty: values.royalty ?? royalty,
      duration: values.duration ?? duration
    };
    
    setEnabled(newValues.enabled);
    setDiscount(newValues.discount);
    setRoyalty(newValues.royalty);
    setDuration(newValues.duration);
    
    onChange?.(newValues);
  };

  const discountedPrice = listingPrice * (1 - discount / 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Legacy Share Option</CardTitle>
            <CardDescription>
              Reduce upfront cost in exchange for future revenue share
            </CardDescription>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => handleChange({ enabled: checked })}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {enabled && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Upfront Discount
                </Label>
                <span className="font-medium">{discount}%</span>
              </div>
              <Slider
                value={[discount]}
                onValueChange={([value]) => handleChange({ discount: value })}
                min={5}
                max={30}
                step={5}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Original: ${listingPrice.toLocaleString()}</span>
                <span>New: ${discountedPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4" />
                  Royalty Percentage
                </Label>
                <span className="font-medium">{royalty}%</span>
              </div>
              <Slider
                value={[royalty]}
                onValueChange={([value]) => handleChange({ royalty: value })}
                min={5}
                max={20}
                step={5}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration (Months)
                </Label>
                <span className="font-medium">{duration} months</span>
              </div>
              <Slider
                value={[duration]}
                onValueChange={([value]) => handleChange({ duration: value })}
                min={12}
                max={36}
                step={12}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}