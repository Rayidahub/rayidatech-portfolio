// scripts/test-email.js
// Interactive CLI test runner for Transactional Email (Resend)
const fs = require('fs');
const path = require('path');

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf-8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      const val = line.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  }
}

loadEnvLocal();

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || 'Rayida Tech <info@rayidatech.name.ng>';
const adminEmail = process.env.ADMIN_EMAIL || 'info@rayidatech.name.ng';

console.log('\n=========================================');
console.log(' Rayida Tech — Transactional Email Test  ');
console.log('=========================================\n');

console.log(`• RESEND_API_KEY : ${apiKey ? apiKey.slice(0, 7) + '...' + apiKey.slice(-4) : '(NOT CONFIGURED - Simulation Mode)'}`);
console.log(`• EMAIL_FROM     : ${from}`);
console.log(`• ADMIN_EMAIL    : ${adminEmail}\n`);

if (!apiKey) {
  console.log('ℹ️  Current Status: SIMULATION MODE ACTIVE');
  console.log('--------------------------------------------------');
  console.log('Because no RESEND_API_KEY is found in .env.local,');
  console.log('all emails are logged to the console safely without');
  console.log('making external HTTP requests.\n');
  process.exit(0);
}

async function runLiveTest() {
  console.log('🚀 Sending live lead alert test email via Resend REST API...');

  const submittedAt = new Date().toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  const testPayload = {
    from,
    to: [adminEmail],
    reply_to: 'test.client@example.com',
    subject: '🧪 [Lead Alert Test] Alex Mercer — AI Platform Consultation',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1a1a2e; color: #f2f2f2; padding: 24px; margin: 0; }
            .card { background-color: #22223b; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .badge { display: inline-block; background-color: #8000ff; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            .logo-text { font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 20px; }
            .logo-sub { color: #00d1ff; }
            h1 { margin-top: 12px; font-size: 22px; color: #ffffff; }
            .row { border-bottom: 1px solid rgba(255,255,255,0.08); padding: 12px 0; }
            .label { font-size: 11px; color: #b8b8c8; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-size: 15px; font-weight: 600; color: #ffffff; margin-top: 4px; }
            .message-box { background-color: rgba(0,0,0,0.3); border-left: 3px solid #00d1ff; padding: 16px; border-radius: 8px; margin-top: 16px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #eaeaea; }
            .footer { font-size: 12px; color: #b8b8c8; text-align: center; margin-top: 24px; }
            .reply-banner { background-color: rgba(0, 209, 255, 0.1); border: 1px solid rgba(0, 209, 255, 0.25); border-radius: 8px; padding: 12px 16px; margin-top: 20px; font-size: 13px; color: #00d1ff; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo-text">Rayida<span class="logo-sub">Tech</span></div>
            <span class="badge">Live Test Inquiry</span>
            <h1>Inquiry from Alex Mercer</h1>
            <div class="row">
              <div class="label">Sender Name</div>
              <div class="value">Alex Mercer</div>
            </div>
            <div class="row">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:test.client@example.com" style="color: #00d1ff; text-decoration: none;">test.client@example.com</a></div>
            </div>
            <div class="row">
              <div class="label">Subject / Scope</div>
              <div class="value">AI Platform Consultation</div>
            </div>
            <div class="row">
              <div class="label">Company / Brand</div>
              <div class="value">Mercer Systems Inc.</div>
            </div>
            <div class="row">
              <div class="label">Estimated Budget</div>
              <div class="value" style="color: #00d1ff;">$10,000+</div>
            </div>
            <div class="row">
              <div class="label">Submission Date & Time</div>
              <div class="value" style="font-size: 13px; color: #b8b8c8;">${submittedAt}</div>
            </div>
            <div class="row" style="border-bottom: none;">
              <div class="label">Message</div>
              <div class="message-box">Hi Raymond, testing the outbound delivery pipeline from rayidatech.name.ng to info@rayidatech.name.ng. Looking forward to connecting.</div>
            </div>
            <div class="reply-banner">
              💡 <strong>Reply-To Verified:</strong> Hitting <em>Reply</em> in Zoho Mail directly replies to <strong>test.client@example.com</strong>.
            </div>
          </div>
          <div class="footer">
            Dispatched via Resend REST API • Rayida Tech Portfolio
          </div>
        </body>
      </html>
    `,
    text: [
      `RAYIDA TECH — LIVE INQUIRY TEST`,
      `============================================================`,
      `Name:             Alex Mercer`,
      `Email:            test.client@example.com`,
      `Subject:          AI Platform Consultation`,
      `Company:          Mercer Systems Inc.`,
      `Budget:           $10,000+`,
      `Submitted:        ${submittedAt}`,
      ``,
      `Message:`,
      `Hi Raymond, testing the outbound delivery pipeline from rayidatech.name.ng to info@rayidatech.name.ng.`,
      ``,
      `Reply-To: test.client@example.com`,
    ].join('\n'),
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`\n❌ Resend API Error (${res.status}):`);
      console.error(errText);
      process.exit(1);
    }

    const data = await res.json();
    console.log('\n✅ Email successfully dispatched and verified by Resend!');
    console.log(`• Resend Message ID : ${data.id}`);
    console.log(`• From (Sender)     : ${from}`);
    console.log(`• To (Recipient)    : ${adminEmail}`);
    console.log(`• Reply-To          : test.client@example.com`);
    console.log(`• Timestamp         : ${submittedAt}\n`);
  } catch (err) {
    console.error('\n❌ Network or execution error:', err.message);
    process.exit(1);
  }
}

runLiveTest();
