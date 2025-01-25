import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Here you would typically send this to your analytics service
  // For now, we'll just log it
  console.log('Analytics event:', data);
  
  return NextResponse.json({ success: true });
} 