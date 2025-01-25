import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { event as logAnalyticsEvent } from '@/lib/analytics';

// Input validation schema
const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(50),
  email: z.string().email(),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email } = updateProfileSchema.parse(body);

    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check email uniqueness (excluding current user)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .neq('id', user.id)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Update auth email
    const { error: updateAuthError } = await supabase.auth.updateUser({
      email: email,
    });

    if (updateAuthError) {
      return NextResponse.json(
        { error: updateAuthError.message },
        { status: 400 }
      );
    }

    // Update profile
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        full_name,
        email,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateProfileError) {
      return NextResponse.json(
        { error: updateProfileError.message },
        { status: 400 }
      );
    }

    // Log the profile update
    logAnalyticsEvent({
      action: 'update_profile',
      category: 'profile',
      label: user.id,
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: { full_name, email }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}