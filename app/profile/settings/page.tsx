'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileUpdateForm } from '@/components/profile/profile-update-form';
import { useAuth } from '@/components/auth-provider';
import { mockProfile } from '@/lib/mock-data';

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  // For demo, use mock data
  const profileData = {
    full_name: mockProfile.full_name || '',
    email: user?.email || mockProfile.email || '',
  };

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information and email preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileUpdateForm initialData={profileData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}