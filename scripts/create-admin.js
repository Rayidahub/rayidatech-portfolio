// scripts/create-admin.js
//
// One-time local helper: creates an admin user in Supabase Auth.
//
// Usage:
//   1. Add SUPABASE_SERVICE_ROLE_KEY to your .env.local
//   2. node scripts/create-admin.js [email] [password]
//
// WARNING: This is for local development only. Do not run in production.

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return

  const content = fs.readFileSync(envPath, 'utf-8')
  for (const line of content.split('\n')) {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/)
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
    }
  }
}

loadEnvLocal()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const email = process.argv[2] || 'admin@rayidatech.com'
const password = process.argv[3] || 'RayidaAdmin123!'

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    console.error('Failed to create admin user:', error.message)
    process.exit(1)
  }

  console.log('Admin user created successfully:')
  console.log('  Email:', data.user.email)
  console.log('  Password:', password)
  console.log('  ID:', data.user.id)
  console.log('\nYou can now sign in at http://localhost:3000/admin/login')
}

main()
