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
const from = process.env.EMAIL_FROM || 'Rayida Tech <onboarding@resend.dev>';
const adminEmail = process.env.ADMIN_EMAIL || 'rayidagaius@gmail.com';

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
  console.log('👉 To enable LIVE email dispatch:');
  console.log('1. Go to https://resend.com/api-keys');
  console.log('2. Sign up / Log in and create an API Key (starts with re_...)');
  console.log('3. Add the following to your .env.local file:');
  console.log('   RESEND_API_KEY=re_your_api_key_here');
  console.log('   EMAIL_FROM="Rayida Tech <onboarding@resend.dev>"');
  console.log('   ADMIN_EMAIL=rayidagaius@gmail.com');
  console.log('4. Run `npm run email:test` again to send a live test!\n');
  process.exit(0);
}

async function runLiveTest() {
  console.log('🚀 Sending live test email via Resend REST API...');
  
  const testPayload = {
    from,
    to: [adminEmail],
    subject: '🧪 [Test] Rayida Tech Email Service Connected',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1a1a2e; color: #f2f2f2; padding: 24px;">
        <div style="background-color: #22223b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #00d1ff; margin-top: 0;">Email Service Active!</h2>
          <p style="color: #b8b8c8; font-size: 14px; line-height: 1.6;">
            Your Resend REST API connection is functioning properly.
          </p>
          <div style="background-color: rgba(128, 0, 255, 0.15); border-left: 3px solid #8000ff; padding: 12px; margin: 16px 0; font-size: 13px;">
            <strong>Recipient:</strong> ${adminEmail}<br/>
            <strong>Sender:</strong> ${from}<br/>
            <strong>Timestamp:</strong> ${new Date().toISOString()}
          </div>
          <p style="font-size: 12px; color: #7d7d92; margin-bottom: 0;">
            Dispatched from Rayida Tech Portfolio Test Runner
          </p>
        </div>
      </div>
    `,
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
      console.log('\n💡 Tip:');
      if (errText.includes('domain is not verified')) {
        console.log('  If testing without domain verification, use:');
        console.log('  EMAIL_FROM="Rayida Tech <onboarding@resend.dev>"');
        console.log('  and send to the email you registered on Resend.');
      }
      process.exit(1);
    }

    const data = await res.json();
    console.log('\n✅ Email successfully sent!');
    console.log(`• Resend Message ID: ${data.id}`);
    console.log(`• Check inbox for: ${adminEmail}\n`);
  } catch (err) {
    console.error('\n❌ Network or execution error:', err.message);
    process.exit(1);
  }
}

runLiveTest();

