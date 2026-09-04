declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export function trackPurchase(data?: {
  value?: number;
  currency?: string;
  content_name?: string;
  phone?: string;
  email?: string;
}) {
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        value: data?.value ?? 0,
        currency: data?.currency ?? 'VND',
        content_name: data?.content_name ?? 'Khóa Học Offline Video Marketing 2 Ngày',
        ...(data?.phone ? { phone: data.phone } : {}),
        ...(data?.email ? { email: data.email } : {}),
      });
      console.log('[Meta Pixel] Fired Purchase conversion event successfully');
    }
  } catch (err) {
    console.warn('[Meta Pixel] Failed to track Purchase event:', err);
  }
}
