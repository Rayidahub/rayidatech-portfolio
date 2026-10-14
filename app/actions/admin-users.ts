'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  getAdminUsers,
  getAdminUserByEmail,
  getAdminUserById,
  saveAdminUser,
  deleteAdminUser,
  ROOT_SUPER_ADMIN_EMAIL,
} from '@/lib/data/admin-users';
import type { AdminUser, AdminRole, AdminPermission } from '@/types/admin-user';

/**
 * Helper to authenticate and verify the current session user
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser || !authUser.email) {
      return null;
    }

    const adminUser = await getAdminUserByEmail(authUser.email);
    return adminUser;
  } catch (err) {
    console.error('Error fetching current admin user:', err);
    return null;
  }
}

/**
 * Fetch all admin users (Super Admin or Admin only)
 */
export async function getAdminUsersAction(): Promise<{
  success: boolean;
  users?: AdminUser[];
  currentUser?: AdminUser | null;
  error?: string;
}> {
  const current = await getCurrentAdminUser();
  if (!current) {
    return { success: false, error: 'Authentication required' };
  }

  const users = await getAdminUsers();
  return { success: true, users, currentUser: current };
}

/**
 * Create a new admin user (Super Admin only)
 */
export async function createAdminUserAction(payload: {
  email: string;
  name?: string;
  role: AdminRole;
  permissions?: AdminPermission[];
  is_active?: boolean;
  password?: string;
}): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const current = await getCurrentAdminUser();
  if (!current || current.role !== 'super_admin') {
    return {
      success: false,
      error: 'Permission denied: Only Super Admins can create new administrators or assign roles.',
    };
  }

  const email = payload.email.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  // Check if email already exists
  const existing = await getAdminUserByEmail(email);
  if (existing) {
    return {
      success: false,
      error: `An administrator with email ${email} already exists. You can edit their role instead.`,
    };
  }

  // If initial password was supplied, attempt Supabase Auth registration
  if (payload.password && payload.password.trim().length >= 6) {
    try {
      const supabase = await createClient();
      await supabase.auth.signUp({
        email,
        password: payload.password,
        options: {
          data: {
            name: payload.name?.trim() || email.split('@')[0],
          },
        },
      });
    } catch (authErr) {
      console.warn('Supabase auth signup attempt:', authErr);
    }
  }

  const result = await saveAdminUser({
    email,
    name: payload.name?.trim() || email.split('@')[0],
    role: payload.role,
    permissions: payload.permissions || [],
    is_active: payload.is_active ?? true,
  });

  if (result.success) {
    revalidatePath('/admin/users');
    revalidatePath('/admin');
  }

  return result;
}

/**
 * Update an existing admin user's role and permissions (Super Admin only)
 */
export async function updateAdminUserAction(payload: {
  id: string;
  email: string;
  name?: string;
  role: AdminRole;
  permissions?: AdminPermission[];
  is_active?: boolean;
}): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const current = await getCurrentAdminUser();
  if (!current || current.role !== 'super_admin') {
    return {
      success: false,
      error: 'Permission denied: Only Super Admins can modify admin roles or access rights.',
    };
  }

  const target = await getAdminUserById(payload.id);
  if (!target) {
    return { success: false, error: 'Administrator not found.' };
  }

  // Prevent demoting or deactivating the primary Super Admin
  if (
    target.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase() &&
    (payload.role !== 'super_admin' || payload.is_active === false)
  ) {
    return {
      success: false,
      error: 'The primary Super Admin account cannot be demoted or deactivated.',
    };
  }

  // Prevent super admin from accidentally deactivating their own currently logged-in account
  if (current.id === target.id && payload.is_active === false) {
    return {
      success: false,
      error: 'You cannot deactivate your own active Super Admin session.',
    };
  }

  const result = await saveAdminUser({
    id: payload.id,
    email: payload.email,
    name: payload.name !== undefined ? payload.name : target.name,
    role: payload.role,
    permissions: payload.permissions,
    is_active: payload.is_active !== undefined ? payload.is_active : target.is_active,
  });

  if (result.success) {
    revalidatePath('/admin/users');
    revalidatePath('/admin');
  }

  return result;
}

/**
 * Toggle active/inactive status (Super Admin only)
 */
export async function toggleUserStatusAction(
  id: string,
  newStatus: boolean
): Promise<{ success: boolean; error?: string }> {
  const current = await getCurrentAdminUser();
  if (!current || current.role !== 'super_admin') {
    return { success: false, error: 'Permission denied: Super Admin access required.' };
  }

  const target = await getAdminUserById(id);
  if (!target) {
    return { success: false, error: 'User not found.' };
  }

  if (target.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, error: 'The primary Super Admin account cannot be deactivated.' };
  }

  if (current.id === target.id && !newStatus) {
    return { success: false, error: 'You cannot deactivate your own active session.' };
  }

  const result = await saveAdminUser({
    ...target,
    is_active: newStatus,
  });

  if (result.success) {
    revalidatePath('/admin/users');
  }

  return { success: result.success, error: result.error };
}

/**
 * Delete an admin user (Super Admin only)
 */
export async function deleteAdminUserAction(id: string): Promise<{ success: boolean; error?: string }> {
  const current = await getCurrentAdminUser();
  if (!current || current.role !== 'super_admin') {
    return {
      success: false,
      error: 'Permission denied: Only Super Admins can remove administrators.',
    };
  }

  const target = await getAdminUserById(id);
  if (!target) {
    return { success: false, error: 'Administrator not found.' };
  }

  if (target.email.toLowerCase() === ROOT_SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, error: 'The primary Super Admin account cannot be deleted.' };
  }

  if (current.id === target.id) {
    return { success: false, error: 'You cannot delete your own active account.' };
  }

  const result = await deleteAdminUser(id);
  if (result.success) {
    revalidatePath('/admin/users');
    revalidatePath('/admin');
  }

  return result;
}

