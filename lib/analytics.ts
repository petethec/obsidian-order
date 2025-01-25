// Google Analytics Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

interface AnalyticsEvent {
  action: string;
  category: string;
  label: string;
}

export async function event(data: AnalyticsEvent) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to send analytics:', error);
  }
}