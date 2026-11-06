// lib/supabase/auth-guard.ts
import { createClient } from '@/lib/supabase/server';
import { getAdminUserByEmail, ROOT_SUPER_ADMIN_EMAIL, isRootSuperAdminEmail } from '@/lib/data/admin-users';
import type { AdminUser } from '@/types/admin-user';

export interface AuthGuardResult {
  authenticated: boolean;
  user: { id: string; email: string } | null;
  adminProfile: AdminUser | null;
  error?: string;
}

/**
 * Validates that the active session belongs to an authenticated administrator
 * or the root super administrator.
 */
export async function requireAdminSession(): Promise<AuthGuardResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return {
        authenticated: false,
        user: null,
        adminProfile: null,
        error: 'Unauthorized: Admin authentication required',
      };
    }

    const isRoot = isRootSuperAdminEmail(user.email);
    const profile = await getAdminUserByEmail(user.email);

    if (!isRoot && (!profile || profile.is_active === false)) {
      return {
        authenticated: false,
        user: { id: user.id, email: user.email },
        adminProfile: profile,
        error: 'Forbidden: Admin access deactivated or unauthorized',
      };
    }

    return {
      authenticated: true,
      user: { id: user.id, email: user.email },
      adminProfile: profile,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      authenticated: false,
      user: null,
      adminProfile: null,
      error: `Auth check failed: ${msg}`,
    };
  }
}

