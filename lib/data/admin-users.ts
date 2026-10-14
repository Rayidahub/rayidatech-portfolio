import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { ROOT_SUPER_ADMIN_EMAIL } from '@/types/admin-user';
import type { AdminUser, AdminRole, AdminPermission } from '@/types/admin-user';

export { ROOT_SUPER_ADMIN_EMAIL };

export const ALL_PERMISSION_KEYS: AdminPermission[] = [
  'dashboard',
  'projects',
  'services',
  'blog',
  'hero',
  'coming_soon',
  'testimonials',
  'team',
  'contacts',
  'users',
];

export const ADMIN_CONTENT_PERMISSION_KEYS: AdminPermission[] = [
  'dashboard',
  'projects',
  'services',
  'blog',
  'hero',
  'coming_soon',
  'testimonials',
  'team',
  'contacts',
];

const LOCAL_USERS_FILE = path.join(process.cwd(), 'lib/data/admin-users.json');

export const defaultRootSuperAdmin: AdminUser = {
  id: 'root-super-admin-01',
  email: ROOT_SUPER_ADMIN_EMAIL,
  name: 'Raymond Gaius',
  role: 'super_admin',
  permissions: [...ALL_PERMISSION_KEYS],
  is_active: true,
  avatar_url: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function readLocalUsers(): AdminUser[] {
  try {
    if (fs.existsSync(LOCAL_USERS_FILE)) {
      const raw = fs.readFileSync(LOCAL_USERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading local admin users:', err);
  }
  return [defaultRootSuperAdmin];
}

function writeLocalUsers(users: AdminUser[]): void {
  try {
    const dir = path.dirname(LOCAL_USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing local admin users:', err);
  }
}

/**
 * Normalizes user permissions based on their assigned role
 */
export function normalizePermissions(role: AdminRole, rawPermissions?: AdminPermission[]): AdminPermission[] {
  if (role === 'super_admin') {
    return [...ALL_PERMISSION_KEYS];
  }
  if (role === 'admin') {
    return [...ADMIN_CONTENT_PERMISSION_KEYS];
  }
  // For editor role: always include dashboard, plus any custom selected permissions
  const set = new Set<AdminPermission>(rawPermissions || []);
  set.add('dashboard');
  set.delete('users'); // Editors cannot have users permission
  return Array.from(set);
}

/**
 * Check if an admin user has access to a specific permission
 */
export function hasPermission(
  user: AdminUser | null | undefined,
  permission: AdminPermission
): boolean {
  if (!user || !user.is_active) return false;
  if (user.role === 'super_admin') return true;
  if (user.role === 'admin') return permission !== 'users';
  return user.permissions?.includes(permission) ?? false;
}

/**
 * Fetch all admin users
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      const normalizedUsers: AdminUser[] = data.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name ?? '',
        role: u.role as AdminRole,
        permissions: normalizePermissions(u.role as AdminRole, u.permissions as AdminPermission[]),
        is_active: u.is_active ?? true,
        avatar_url: u.avatar_url ?? '',
        created_at: u.created_at,
        updated_at: u.updated_at,
        last_login: u.last_login,
      }));

      // Cache locally
      writeLocalUsers(normalizedUsers);
      return normalizedUsers;
    }
  } catch (err) {
    console.warn('Supabase fetch error for admin_users, falling back to local storage:', err);
  }

  // Fallback to local storage
  const local = readLocalUsers();
  // Ensure root super admin is present
  const hasRoot = local.some((u) => u.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase());
  if (!hasRoot) {
    local.unshift(defaultRootSuperAdmin);
    writeLocalUsers(local);
  }
  return local;
}

/**
 * Find an admin user by email
 */
export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('email', normalizedEmail)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        email: data.email,
        name: data.name ?? '',
        role: data.role as AdminRole,
        permissions: normalizePermissions(data.role as AdminRole, data.permissions as AdminPermission[]),
        is_active: data.is_active ?? true,
        avatar_url: data.avatar_url ?? '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        last_login: data.last_login,
      };
    }
  } catch {
    // Continue to local fallback
  }

  const localUsers = readLocalUsers();
  const found = localUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (found) {
    return {
      ...found,
      permissions: normalizePermissions(found.role, found.permissions),
    };
  }

  // If email is root super admin, auto-seed them
  if (normalizedEmail === ROOT_SUPER_ADMIN_EMAIL.toLowerCase()) {
    const rootUser = {
      ...defaultRootSuperAdmin,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localUsers.unshift(rootUser);
    writeLocalUsers(localUsers);
    return rootUser;
  }

  // If local users is empty and anyone signs in, allow first user as super_admin
  if (localUsers.length === 0) {
    const firstAdmin: AdminUser = {
      id: 'first-super-admin',
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: 'super_admin',
      permissions: [...ALL_PERMISSION_KEYS],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    writeLocalUsers([firstAdmin]);
    return firstAdmin;
  }

  return null;
}

/**
 * Find an admin user by ID
 */
export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        email: data.email,
        name: data.name ?? '',
        role: data.role as AdminRole,
        permissions: normalizePermissions(data.role as AdminRole, data.permissions as AdminPermission[]),
        is_active: data.is_active ?? true,
        avatar_url: data.avatar_url ?? '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        last_login: data.last_login,
      };
    }
  } catch {
    // Continue to local fallback
  }

  const localUsers = readLocalUsers();
  return localUsers.find((u) => u.id === id) ?? null;
}

/**
 * Save or update an admin user
 */
export async function saveAdminUser(
  userData: Partial<AdminUser> & { email: string }
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const email = userData.email.trim().toLowerCase();
  if (!email) {
    return { success: false, error: 'Email address is required' };
  }

  const now = new Date().toISOString();
  const localUsers = readLocalUsers();
  const existingIndex = localUsers.findIndex((u) => u.email.toLowerCase() === email || (userData.id && u.id === userData.id));

  // Safeguard: The root super admin cannot be demoted or deactivated
  const isRootAdmin = email === ROOT_SUPER_ADMIN_EMAIL.toLowerCase();
  const targetRole: AdminRole = isRootAdmin ? 'super_admin' : (userData.role || 'editor');
  const targetIsActive = isRootAdmin ? true : (userData.is_active ?? true);
  const targetPermissions = normalizePermissions(targetRole, userData.permissions);

  let userToSave: AdminUser;

  if (existingIndex >= 0) {
    const existing = localUsers[existingIndex];
    userToSave = {
      ...existing,
      email,
      name: userData.name !== undefined ? userData.name : existing.name,
      role: targetRole,
      permissions: targetPermissions,
      is_active: targetIsActive,
      avatar_url: userData.avatar_url !== undefined ? userData.avatar_url : existing.avatar_url,
      updated_at: now,
    };
    localUsers[existingIndex] = userToSave;
  } else {
    const newId = userData.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}`);
    userToSave = {
      id: newId,
      email,
      name: userData.name || email.split('@')[0],
      role: targetRole,
      permissions: targetPermissions,
      is_active: targetIsActive,
      avatar_url: userData.avatar_url || '',
      created_at: now,
      updated_at: now,
    };
    localUsers.push(userToSave);
  }

  // Write local fallback
  writeLocalUsers(localUsers);

  // Sync to Supabase
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('admin_users').upsert({
      id: userToSave.id,
      email: userToSave.email,
      name: userToSave.name,
      role: userToSave.role,
      permissions: userToSave.permissions,
      is_active: userToSave.is_active,
      avatar_url: userToSave.avatar_url,
      updated_at: now,
    });

    if (error) {
      console.warn('Supabase upsert warning for admin_users (saved locally):', error.message);
    }
  } catch (err: any) {
    console.warn('Supabase connection warning for admin_users (saved locally):', err?.message);
  }

  return { success: true, user: userToSave };
}

/**
 * Delete an admin user
 */
export async function deleteAdminUser(id: string): Promise<{ success: boolean; error?: string }> {
  const localUsers = readLocalUsers();
  const user = localUsers.find((u) => u.id === id);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (user.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, error: 'Cannot delete the primary Super Admin account' };
  }

  const updatedList = localUsers.filter((u) => u.id !== id);
  writeLocalUsers(updatedList);

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete warning for admin_users (deleted locally):', error.message);
    }
  } catch (err: any) {
    console.warn('Supabase connection warning on delete (deleted locally):', err?.message);
  }

  return { success: true };
}

/**
 * Verifies if the currently logged in admin has permission for a specific section
 */
export async function verifySectionAccess(permission: AdminPermission): Promise<{
  authorized: boolean;
  currentUser: AdminUser | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser || !authUser.email) {
      return { authorized: false, currentUser: null };
    }

    const adminUser = await getAdminUserByEmail(authUser.email);
    if (!adminUser || !adminUser.is_active) {
      return { authorized: false, currentUser: adminUser };
    }

    const authorized = hasPermission(adminUser, permission);
    return { authorized, currentUser: adminUser };
  } catch (err) {
    console.error('Error verifying section access:', err);
    return { authorized: false, currentUser: null };
  }
}


