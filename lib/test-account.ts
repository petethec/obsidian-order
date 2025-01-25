import { supabase } from './supabase/client';

export const TEST_ACCOUNT = {
  email: 'test@example.com',
  password: 'test123456',
  username: 'testuser' + Math.random().toString(36).substring(2, 8),
};

export async function createTestAccount() {
  try {
    // Check if the account already exists
    const { data: { user: existingUser } } = await supabase.auth.signInWithPassword({
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
    });

    if (existingUser) {
      return {
        success: true,
        message: 'Test account already exists',
        credentials: TEST_ACCOUNT,
      };
    }

    // Create new test account
    const { error } = await supabase.auth.signUp({
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
      options: {
        data: {
          username: TEST_ACCOUNT.username,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Test account created successfully',
      credentials: TEST_ACCOUNT,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create test account',
      credentials: TEST_ACCOUNT,
    };
  }
}