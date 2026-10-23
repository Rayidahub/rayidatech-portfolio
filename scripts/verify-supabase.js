// scripts/verify-supabase.js
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

const TABLES = [
  'projects',
  'posts',
  'contacts',
  'services',
  'testimonials',
  'hero_slides',
  'ecosystem_products',
  'subscribers',
  'team_members',
  'contact_settings',
  'blog_settings',
  'hero_settings',
  'admin_users',
  'site_settings',
  'visitor_logs'
];

async function checkTables() {
  console.log(`Checking Supabase connection: ${url}\n`);
  const results = [];

  for (const table of TABLES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        results.push({ table, status: 'MISSING / ERROR', details: error.message });
      } else {
        const countRes = await supabase.from(table).select('*', { count: 'exact', head: true });
        results.push({ table, status: 'EXISTS', rows: countRes.count ?? 0 });
      }
    } catch (err) {
      results.push({ table, status: 'EXCEPTION', details: err.message });
    }
  }

  console.table(results);
}

checkTables();
