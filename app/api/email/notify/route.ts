// app/api/email/notify/route.ts
import { NextResponse } from 'next/server';
import { sendContactNotification, sendNewsletterWelcome } from '@/lib/email';
import type { ContactNotificationPayload } from '@/lib/email';

// In-memory sliding window rate limiter: max 5 requests per 10 minutes per IP
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean expired record
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    // 1. Extract IP for rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const clientIp = forwardedFor.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before submitting again.' },
        { status: 429, headers: { 'Retry-After': '600' } }
      );
    }

    const body = await req.json();
    const { type, data, honeypot } = body;

    // 2. Honeypot check: If bot filled hidden honeypot field, silently discard
    if (honeypot || data?.honeypot || data?.hp_field) {
      console.warn(`[API:email/notify] Bot detected via honeypot from IP: ${clientIp}`);
      return NextResponse.json({ success: true, simulated: true });
    }

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data in request body' },
        { status: 400 }
      );
    }

    if (type === 'contact') {
      const payload = data as ContactNotificationPayload;
      if (!payload.name || !payload.email || !payload.message) {
        return NextResponse.json(
          { error: 'Contact requires name, email, and message' },
          { status: 400 }
        );
      }

      // Input sanitization, email format validation and header injection prevention
      const email = payload.email.trim().toLowerCase();
      if (!EMAIL_REGEX.test(email) || email.length > 255 || /[\r\n]/.test(email)) {
        return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
      }

      const sanitize = (val?: string | null) => (val ? String(val).replace(/[\r\n\t]/g, ' ').trim() : null);

      const sanitizedPayload: ContactNotificationPayload = {
        name: sanitize(payload.name)!.slice(0, 100),
        email,
        subject: sanitize(payload.subject || payload.project_type || 'General Inquiry')?.slice(0, 150),
        phone: sanitize(payload.phone)?.slice(0, 50),
        company: sanitize(payload.company)?.slice(0, 100),
        project_type: sanitize(payload.project_type || payload.subject)?.slice(0, 100),
        budget: sanitize(payload.budget)?.slice(0, 50),
        message: payload.message.trim().slice(0, 5000),
        submitted_at: new Date().toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        }),
      };

      const results = await sendContactNotification(sanitizedPayload);
      return NextResponse.json({ success: true, results });
    }

    if (type === 'newsletter') {
      const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
      if (!email || !EMAIL_REGEX.test(email) || email.length > 255) {
        return NextResponse.json(
          { error: 'Invalid email address format' },
          { status: 400 }
        );
      }

      const result = await sendNewsletterWelcome(email);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json(
      { error: `Unsupported email notification type: ${type}` },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[API:email/notify] Exception:', message);
    return NextResponse.json(
      { error: 'Internal server error while processing email notification' },
      { status: 500 }
    );
  }
}
