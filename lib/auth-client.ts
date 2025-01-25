import { v4 as uuidv4 } from 'uuid';

// Client-side auth handling for static export
export function getUser() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function signIn(credentials: { email: string; password: string }) {
  // For demo, store test user in localStorage
  localStorage.setItem('user', JSON.stringify({
    id: uuidv4(),
    email: credentials.email,
    user_metadata: { username: credentials.email.split('@')[0] }
  }));
  return Promise.resolve();
}

export function signOut() {
  localStorage.removeItem('user');
  return Promise.resolve();
}