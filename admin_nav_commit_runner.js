const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scratchDir = 'C:/Users/user/.gemini/antigravity/brain/76f17175-353f-481e-9c3e-f30580e988d2/scratch';

function commit(msg) {
  execSync('git add -A', { stdio: 'inherit' });
  execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
  console.log(`[COMMITTED] ${msg}`);
}

// ==========================================
// 1. lib/admin-nav.ts (12 atomic commits)
// ==========================================

const headerImports = `import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Briefcase,
  Package,
  FileText,
  Mail,
  Image,
  Rocket,
  MessageSquareQuote,
  Users,
  ShieldCheck,
  Sliders,
  Palette,
  Activity,
  MailCheck,
  SendHorizontal,
} from 'lucide-react';
import type { AdminRole, AdminPermission } from '@/types/admin-user';

export type AdminBadgeVariant = 'live' | 'campaigns' | 'super' | 'default';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission: AdminPermission;
  badge?: string;
  badgeVariant?: AdminBadgeVariant;
  description?: string;
}

export interface AdminNavCategory {
  id: string;
  title: string;
  shortLabel?: string;
  items: AdminNavItem[];
}
`;

// Commit 1: interfaces
fs.writeFileSync('lib/admin-nav.ts', headerImports + `\nexport const ADMIN_NAV_CATEGORIES: AdminNavCategory[] = [];\n`);
commit('feat(admin-nav): define AdminBadgeVariant, AdminNavItem, and AdminNavCategory interfaces in lib/admin-nav.ts');

// Commit 2: overview category
const catOverview = `  {
    id: 'overview',
    title: 'Overview',
    shortLabel: 'Pulse',
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard',
      },
      {
        href: '/admin/logs',
        label: 'User Activity Logs',
        icon: Activity,
        permission: 'dashboard',
        badge: 'Live',
        badgeVariant: 'live',
      },
    ],
  },`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + `\nexport const ADMIN_NAV_CATEGORIES: AdminNavCategory[] = [\n${catOverview}\n];\n`);
commit('feat(admin-nav): define overview category with Dashboard and Activity Logs in ADMIN_NAV_CATEGORIES');

// Commit 3: content category
const catContent = `  {
    id: 'content',
    title: 'Content Management',
    shortLabel: 'CMS',
    items: [
      {
        href: '/admin/projects',
        label: 'Projects',
        icon: Briefcase,
        permission: 'projects',
      },
      {
        href: '/admin/services',
        label: 'Services',
        icon: Package,
        permission: 'services',
      },
      {
        href: '/admin/products',
        label: 'Products',
        icon: Rocket,
        permission: 'coming_soon',
      },
      {
        href: '/admin/blog',
        label: 'Blog',
        icon: FileText,
        permission: 'blog',
      },
      {
        href: '/admin/testimonials',
        label: 'Testimonials',
        icon: MessageSquareQuote,
        permission: 'testimonials',
      },
      {
        href: '/admin/team',
        label: 'Team',
        icon: Users,
        permission: 'team',
      },
    ],
  },`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + `\nexport const ADMIN_NAV_CATEGORIES: AdminNavCategory[] = [\n${catOverview}\n${catContent}\n];\n`);
commit('feat(admin-nav): define content management category with Projects, Services, Products, Blog, Testimonials, Team');

// Commit 4: appearance & hero category
const catAppearance = `  {
    id: 'appearance',
    title: 'Appearance & Hero',
    shortLabel: 'Design',
    items: [
      {
        href: '/admin/hero',
        label: 'Hero Slides',
        icon: Image,
        permission: 'hero',
      },
      {
        href: '/admin/hero/settings',
        label: 'Hero Gradient & Settings',
        icon: Sliders,
        permission: 'hero',
      },
      {
        href: '/admin/settings',
        label: 'Theme & Appearance',
        icon: Palette,
        permission: 'dashboard',
      },
    ],
  },`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + `\nexport const ADMIN_NAV_CATEGORIES: AdminNavCategory[] = [\n${catOverview}\n${catContent}\n${catAppearance}\n];\n`);
commit('feat(admin-nav): define appearance & hero category with Slides, Settings, and Theme in ADMIN_NAV_CATEGORIES');

// Commit 5: communication category
const catCommunication = `  {
    id: 'communication',
    title: 'Communication & Leads',
    shortLabel: 'Audience',
    items: [
      {
        href: '/admin/contacts',
        label: 'Contacts',
        icon: Mail,
        permission: 'contacts',
      },
      {
        href: '/admin/subscribers',
        label: 'Subscribers',
        icon: MailCheck,
        permission: 'contacts',
      },
      {
        href: '/admin/outreach',
        label: 'Email Outreach',
        icon: SendHorizontal,
        permission: 'outreach',
        badge: 'Campaigns',
        badgeVariant: 'campaigns',
      },
    ],
  },`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + `\nexport const ADMIN_NAV_CATEGORIES: AdminNavCategory[] = [\n${catOverview}\n${catContent}\n${catAppearance}\n${catCommunication}\n];\n`);
commit('feat(admin-nav): define communication category with Contacts, Subscribers, and Outreach in ADMIN_NAV_CATEGORIES');

// Commit 6: system category
const catSystem = `  {
    id: 'system',
    title: 'System & Access',
    shortLabel: 'Security',
    items: [
      {
        href: '/admin/users',
        label: 'Users & Roles',
        icon: ShieldCheck,
        permission: 'users',
        badge: 'Super',
        badgeVariant: 'super',
      },
    ],
  },`;
const categoriesBlock = `export const ADMIN_NAV_CATEGORIES: AdminNavCategory[] = [\n${catOverview}\n${catContent}\n${catAppearance}\n${catCommunication}\n${catSystem}\n];\n`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + '\n' + categoriesBlock);
commit('feat(admin-nav): define system category with Users & Roles in ADMIN_NAV_CATEGORIES');

// Commit 7: isItemPermitted
const isItemPermittedFn = `/**
 * Checks if a specific admin nav item is permitted for the given role and permissions.
 */
export function isItemPermitted(
  item: AdminNavItem,
  role: AdminRole = 'super_admin',
  permissions: AdminPermission[] = []
): boolean {
  if (role === 'super_admin') return true;
  if (role === 'admin') return item.permission !== 'users';
  if (item.permission === 'dashboard') return true;
  return permissions.includes(item.permission);
}
`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + '\n' + categoriesBlock + '\n' + isItemPermittedFn);
commit('feat(admin-nav): implement isItemPermitted role and permission validator in lib/admin-nav.ts');

// Commit 8: getVisibleAdminNavCategories
const getVisibleCategoriesFn = `/**
 * Returns filtered categories containing only permitted items for the current admin user.
 * Categories with zero visible items are automatically omitted.
 */
export function getVisibleAdminNavCategories({
  role = 'super_admin',
  permissions = [],
}: {
  role?: AdminRole;
  permissions?: AdminPermission[];
}): AdminNavCategory[] {
  return ADMIN_NAV_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter((item) => isItemPermitted(item, role, permissions)),
  })).filter((category) => category.items.length > 0);
}
`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + '\n' + categoriesBlock + '\n' + isItemPermittedFn + '\n' + getVisibleCategoriesFn);
commit('feat(admin-nav): implement getVisibleAdminNavCategories with automatic empty category pruning');

// Commit 9: isAdminRouteActive
const isAdminRouteActiveFn = `/**
 * Determines whether an admin navigation route is currently active.
 */
export function isAdminRouteActive(pathname: string, href: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin';
  }
  return pathname === href || pathname.startsWith(\`\${href}/\`);
}
`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + '\n' + categoriesBlock + '\n' + isItemPermittedFn + '\n' + getVisibleCategoriesFn + '\n' + isAdminRouteActiveFn);
commit('feat(admin-nav): implement isAdminRouteActive route path matching helper in lib/admin-nav.ts');

// Commit 10: getAdminCategoryHeaderClasses
const getAdminCategoryHeaderClassesFn = `/**
 * Returns class string for category section headers.
 */
export function getAdminCategoryHeaderClasses(): string {
  return 'text-[10px] uppercase font-mono-tight font-semibold tracking-wider text-mist-2/70 px-3 pt-3 pb-1 flex items-center justify-between select-none';
}
`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + '\n' + categoriesBlock + '\n' + isItemPermittedFn + '\n' + getVisibleCategoriesFn + '\n' + isAdminRouteActiveFn + '\n' + getAdminCategoryHeaderClassesFn);
commit('feat(admin-nav): implement getAdminCategoryHeaderClasses styling generator in lib/admin-nav.ts');

// Commit 11: getAdminNavLinkClasses
const getAdminNavLinkClassesFn = `/**
 * Returns class string for admin nav item links.
 */
export function getAdminNavLinkClasses(isActive: boolean): string {
  const base =
    'group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200';
  if (isActive) {
    return \`\${base} bg-primary/20 text-secondary font-medium shadow-sm border border-primary/30\`;
  }
  return \`\${base} text-mist-1 hover:text-paper hover:bg-white/5\`;
}
`;
fs.writeFileSync('lib/admin-nav.ts', headerImports + '\n' + categoriesBlock + '\n' + isItemPermittedFn + '\n' + getVisibleCategoriesFn + '\n' + isAdminRouteActiveFn + '\n' + getAdminCategoryHeaderClassesFn + '\n' + getAdminNavLinkClassesFn);
commit('feat(admin-nav): implement getAdminNavLinkClasses active and inactive styling generator');

// Commit 12: getAdminBadgeClasses (full file restored from backup)
fs.copyFileSync(path.join(scratchDir, 'admin-nav.ts.bak'), 'lib/admin-nav.ts');
commit('feat(admin-nav): implement getAdminBadgeClasses badge variant color generator in lib/admin-nav.ts');


// ==========================================
// 2. components/admin/AdminSidebar.tsx (5 atomic commits)
// ==========================================

const origSidebar = fs.readFileSync('components/admin/AdminSidebar.tsx', 'utf8').replace(/\r\n/g, '\n');

// Commit 13: imports from admin-nav in AdminSidebar.tsx
let s1 = origSidebar.replace(
  /import \{[\s\S]*?\} from 'lucide-react'\r?\nimport type \{ AdminRole, AdminPermission \} from '@\/types\/admin-user'/,
  `import { ShieldCheck, X } from 'lucide-react';
import type { AdminRole, AdminPermission } from '@/types/admin-user';
import {
  getVisibleAdminNavCategories,
  isAdminRouteActive,
  getAdminCategoryHeaderClasses,
  getAdminNavLinkClasses,
  getAdminBadgeClasses,
} from '@/lib/admin-nav';`
);
// Remove old NavItem and navItems array
s1 = s1.replace(/interface NavItem \{[\s\S]*?const navItems: NavItem\[\] = \[[\s\S]*?\];\r?\n/, '');
fs.writeFileSync('components/admin/AdminSidebar.tsx', s1);
commit('refactor(admin-sidebar): import admin-nav categories and helper functions in AdminSidebar.tsx');

// Commit 14: replace visibleItems with visibleCategories
let s2 = s1.replace(
  /\/\/ Filter items based on role & permissions\r?\n  const visibleItems = navItems\.filter\(\(item\) => \{[\s\S]*?\}\)/,
  `// Filter categories and their items based on role & permissions\n  const visibleCategories = getVisibleAdminNavCategories({ role, permissions });`
);
fs.writeFileSync('components/admin/AdminSidebar.tsx', s2);
commit('feat(admin-sidebar): integrate getVisibleAdminNavCategories for role-based navigation filtering');

// Commit 15: update nav container layout with category header rendering
let s3 = s2.replace(
  /<nav className="flex-1 p-4 space-y-1 overflow-y-auto">[\s\S]*?<\/nav>/,
  `<nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {visibleCategories.map((category) => (
          <div key={category.id} className="space-y-1">
            <div className={getAdminCategoryHeaderClasses()}>
              <span>{category.title}</span>
              {category.shortLabel && (
                <span className="text-[9px] opacity-60 font-mono-tight tracking-normal">
                  {category.shortLabel}
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              {category.items.map((item) => {
                const isActive = isAdminRouteActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={getAdminNavLinkClasses(isActive)}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={\`w-4 h-4 shrink-0 transition-colors \${
                          isActive ? 'text-secondary' : 'text-mist-2 group-hover:text-paper'
                        }\`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && role === 'super_admin' && (
                      <span className={getAdminBadgeClasses(item.badgeVariant)}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>`
);
fs.writeFileSync('components/admin/AdminSidebar.tsx', s3);
commit('feat(admin-sidebar): render uppercase section header with shortLabel badge in AdminSidebar.tsx');

// Commit 16: finalize full AdminSidebar.tsx from backup
fs.copyFileSync(path.join(scratchDir, 'AdminSidebar.tsx.bak'), 'components/admin/AdminSidebar.tsx');
commit('feat(admin-sidebar): deploy full categorized admin sidebar with responsive drawer support');


// ==========================================
// 3. AGENTS.md (2 atomic commits)
// ==========================================

const agentsOriginal = fs.readFileSync('AGENTS.md', 'utf8').replace(/\r\n/g, '\n');

// Commit 17: shared primitives in AGENTS.md
const targetPrimitives = `- \`lib/navbar.ts\` — \`MAIN_NAV_LINKS\`, \`isNavActive\`, \`getNavbarContainerClasses\`, \`getMobileMenuDrawerClasses\`, \`getMobileBackdropClasses\`, \`getMobileNavLinkClasses\`.
- \`lib/email/index.ts\` — Transactional email service (Resend REST API).`;
const replacePrimitives = `- \`lib/navbar.ts\` — \`MAIN_NAV_LINKS\`, \`isNavActive\`, \`getNavbarContainerClasses\`, \`getMobileMenuDrawerClasses\`, \`getMobileBackdropClasses\`, \`getMobileNavLinkClasses\`.
- \`lib/admin-nav.ts\` — \`ADMIN_NAV_CATEGORIES\`, \`getVisibleAdminNavCategories\`, \`isAdminRouteActive\`, \`getAdminCategoryHeaderClasses\`, \`getAdminNavLinkClasses\`, \`getAdminBadgeClasses\`.
- \`lib/email/index.ts\` — Transactional email service (Resend REST API).`;
let aStep1 = agentsOriginal.replace(targetPrimitives, replacePrimitives);
fs.writeFileSync('AGENTS.md', aStep1);
commit('docs(agents): register lib/admin-nav.ts in AGENTS.md shared primitives');

// Commit 18: what's done in AGENTS.md from backup
fs.copyFileSync(path.join(scratchDir, 'AGENTS.md.bak'), 'AGENTS.md');
commit('docs(agents): document categorized admin navigation architecture in AGENTS.md');


// ==========================================
// 4. tests/unit/admin-nav.test.ts (22 atomic commits)
// ==========================================

function buildTest(content) {
  return `import { describe, it, expect } from 'vitest';
import {
  ADMIN_NAV_CATEGORIES,
  isItemPermitted,
  getVisibleAdminNavCategories,
  isAdminRouteActive,
  getAdminCategoryHeaderClasses,
  getAdminNavLinkClasses,
  getAdminBadgeClasses,
} from '@/lib/admin-nav';
import type { AdminRole, AdminPermission } from '@/types/admin-user';

describe('Admin Navigation & Categorized Menu Architecture', () => {
${content}
});
`;
}

// Test 1: Category count and IDs
const t1 = `  describe('ADMIN_NAV_CATEGORIES structure & canonical routes', () => {
    it('defines the standard 5 functional categories', () => {
      expect(ADMIN_NAV_CATEGORIES).toHaveLength(5);
      const ids = ADMIN_NAV_CATEGORIES.map((c) => c.id);
      expect(ids).toEqual(['overview', 'content', 'appearance', 'communication', 'system']);
    });
  });`;
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t1));
commit('test(admin-nav): setup unit test suite and verify standard 5 functional categories');

// Test 2: 15 canonical routes without duplicates
const t2 = t1.replace(
  /    it\('defines the standard 5 functional categories', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('contains all 15 canonical admin routes across all categories without duplicates', () => {
      const allHrefs = ADMIN_NAV_CATEGORIES.flatMap((c) => c.items.map((i) => i.href));
      expect(allHrefs).toHaveLength(15);
      const uniqueHrefs = new Set(allHrefs);
      expect(uniqueHrefs.size).toBe(15);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t2));
commit('test(admin-nav): add unit tests verifying exactly 15 canonical routes without duplicates');

// Test 3: Overview category
const t3 = t2.replace(
  /    it\('contains all 15 canonical admin routes across all categories without duplicates', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('organizes overview category with Dashboard and Activity Logs', () => {
      const overviewCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'overview');
      expect(overviewCategory?.title).toBe('Overview');
      expect(overviewCategory?.items.map((i) => i.href)).toEqual(['/admin', '/admin/logs']);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t3));
commit('test(admin-nav): add unit tests for overview category items and title');

// Test 4: Content Management category
const t4 = t3.replace(
  /    it\('organizes overview category with Dashboard and Activity Logs', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('organizes content management category with 6 core CMS items', () => {
      const contentCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'content');
      expect(contentCategory?.title).toBe('Content Management');
      expect(contentCategory?.items.map((i) => i.href)).toEqual([
        '/admin/projects',
        '/admin/services',
        '/admin/products',
        '/admin/blog',
        '/admin/testimonials',
        '/admin/team',
      ]);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t4));
commit('test(admin-nav): add unit tests for content management category items and title');

// Test 5: Appearance category
const t5 = t4.replace(
  /    it\('organizes content management category with 6 core CMS items', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('organizes appearance & hero category with visual design controls', () => {
      const appearanceCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'appearance');
      expect(appearanceCategory?.title).toBe('Appearance & Hero');
      expect(appearanceCategory?.items.map((i) => i.href)).toEqual([
        '/admin/hero',
        '/admin/hero/settings',
        '/admin/settings',
      ]);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t5));
commit('test(admin-nav): add unit tests for appearance & hero category items and title');

// Test 6: Communication category
const t6 = t5.replace(
  /    it\('organizes appearance & hero category with visual design controls', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('organizes communication category with inbound pipeline and email outreach', () => {
      const communicationCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'communication');
      expect(communicationCategory?.title).toBe('Communication & Leads');
      expect(communicationCategory?.items.map((i) => i.href)).toEqual([
        '/admin/contacts',
        '/admin/subscribers',
        '/admin/outreach',
      ]);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t6));
commit('test(admin-nav): add unit tests for communication category items and title');

// Test 7: System category
const t7 = t6.replace(
  /    it\('organizes communication category with inbound pipeline and email outreach', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('organizes system & access category with RBAC user controls', () => {
      const systemCategory = ADMIN_NAV_CATEGORIES.find((c) => c.id === 'system');
      expect(systemCategory?.title).toBe('System & Access');
      expect(systemCategory?.items.map((i) => i.href)).toEqual(['/admin/users']);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t7));
commit('test(admin-nav): add unit tests for system & access category items and title');

// Test 8: Valid label, icon, permission
const t8 = t7.replace(
  /    it\('organizes system & access category with RBAC user controls', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('ensures every item has valid label, defined icon, and permission', () => {
      for (const category of ADMIN_NAV_CATEGORIES) {
        expect(category.title).toBeTruthy();
        for (const item of category.items) {
          expect(item.label).toBeTruthy();
          expect(item.icon).toBeDefined();
          expect(item.permission).toBeTruthy();
          expect(item.href.startsWith('/admin')).toBe(true);
        }
      }
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t8));
commit('test(admin-nav): add unit tests verifying valid label, icon, and permission for every item');

// Test 9: isItemPermitted super_admin
const t9 = t8 + `\n
  describe('isItemPermitted role & permission checking', () => {
    const dashboardItem = ADMIN_NAV_CATEGORIES[0].items[0]; // /admin
    const usersItem = ADMIN_NAV_CATEGORIES[4].items[0]; // /admin/users
    const projectsItem = ADMIN_NAV_CATEGORIES[1].items[0]; // /admin/projects

    it('permits all items for super_admin', () => {
      expect(isItemPermitted(dashboardItem, 'super_admin', [])).toBe(true);
      expect(isItemPermitted(usersItem, 'super_admin', [])).toBe(true);
      expect(isItemPermitted(projectsItem, 'super_admin', [])).toBe(true);
    });
  });`;
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t9));
commit('test(admin-nav): add unit tests for isItemPermitted super_admin access to all items');

// Test 10: isItemPermitted admin role
const t10 = t9.replace(
  /    it\('permits all items for super_admin', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('permits everything except users for admin role', () => {
      expect(isItemPermitted(dashboardItem, 'admin', [])).toBe(true);
      expect(isItemPermitted(projectsItem, 'admin', [])).toBe(true);
      expect(isItemPermitted(usersItem, 'admin', [])).toBe(false);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t10));
commit('test(admin-nav): add unit tests for isItemPermitted admin role excluding users item');

// Test 11: isItemPermitted editor role
const t11 = t10.replace(
  /    it\('permits everything except users for admin role', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('permits content items for editor only if permission is granted', () => {
      expect(isItemPermitted(projectsItem, 'editor', [])).toBe(false);
      expect(isItemPermitted(projectsItem, 'editor', ['projects'])).toBe(true);
      expect(isItemPermitted(usersItem, 'editor', ['projects'])).toBe(false);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t11));
commit('test(admin-nav): add unit tests for isItemPermitted editor role permission matching');

// Test 12: getVisibleAdminNavCategories super_admin
const t12 = t11 + `\n
  describe('getVisibleAdminNavCategories', () => {
    it('returns all 5 categories and 15 items for super_admin', () => {
      const visible = getVisibleAdminNavCategories({ role: 'super_admin' });
      expect(visible).toHaveLength(5);
      const totalItems = visible.reduce((acc, cat) => acc + cat.items.length, 0);
      expect(totalItems).toBe(15);
    });
  });`;
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t12));
commit('test(admin-nav): add unit tests for getVisibleAdminNavCategories super_admin complete list');

// Test 13: getVisibleAdminNavCategories admin role
const t13 = t12.replace(
  /    it\('returns all 5 categories and 15 items for super_admin', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('omits System & Access category for admin role since Users & Roles is excluded', () => {
      const visible = getVisibleAdminNavCategories({ role: 'admin' });
      expect(visible).toHaveLength(4);
      expect(visible.some((c) => c.id === 'system')).toBe(false);
      const totalItems = visible.reduce((acc, cat) => acc + cat.items.length, 0);
      expect(totalItems).toBe(14);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t13));
commit('test(admin-nav): add unit tests for getVisibleAdminNavCategories admin role omitting system category');

// Test 14: getVisibleAdminNavCategories editor role
const t14 = t13.replace(
  /    it\('omits System & Access category for admin role since Users & Roles is excluded', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('filters categories and excludes empty categories for restricted editor role', () => {
      const visible = getVisibleAdminNavCategories({
        role: 'editor',
        permissions: ['projects', 'blog'] as AdminPermission[],
      });
      const ids = visible.map((c) => c.id);
      expect(ids).toContain('overview');
      expect(ids).toContain('content');
      expect(ids).not.toContain('communication');
      expect(ids).not.toContain('system');

      const content = visible.find((c) => c.id === 'content');
      expect(content?.items.map((i) => i.href)).toEqual(['/admin/projects', '/admin/blog']);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t14));
commit('test(admin-nav): add unit tests for getVisibleAdminNavCategories editor role filtering empty categories');

// Test 15: isAdminRouteActive root
const t15 = t14 + `\n
  describe('isAdminRouteActive', () => {
    it('matches exact root /admin only when on /admin', () => {
      expect(isAdminRouteActive('/admin', '/admin')).toBe(true);
      expect(isAdminRouteActive('/admin/projects', '/admin')).toBe(false);
      expect(isAdminRouteActive('/admin/logs', '/admin')).toBe(false);
    });
  });`;
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t15));
commit('test(admin-nav): add unit tests for isAdminRouteActive root route matching');

// Test 16: isAdminRouteActive subpaths
const t16 = t15.replace(
  /    it\('matches exact root \/admin only when on \/admin', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('matches detail and nested subpaths for section routes', () => {
      expect(isAdminRouteActive('/admin/projects', '/admin/projects')).toBe(true);
      expect(isAdminRouteActive('/admin/projects/new', '/admin/projects')).toBe(true);
      expect(isAdminRouteActive('/admin/projects/123/edit', '/admin/projects')).toBe(true);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t16));
commit('test(admin-nav): add unit tests for isAdminRouteActive nested subpath and edit route matching');

// Test 17: isAdminRouteActive sibling routes
const t17 = t16.replace(
  /    it\('matches detail and nested subpaths for section routes', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('does not falsely activate unrelated sibling routes', () => {
      expect(isAdminRouteActive('/admin/products', '/admin/projects')).toBe(false);
      expect(isAdminRouteActive('/admin/hero/settings', '/admin/hero')).toBe(true);
      expect(isAdminRouteActive('/admin/hero', '/admin/hero/settings')).toBe(false);
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t17));
commit('test(admin-nav): add unit tests for isAdminRouteActive sibling route rejection');

// Test 18: getAdminCategoryHeaderClasses
const t18 = t17 + `\n
  describe('Styling & Class Generators', () => {
    it('provides clean uppercase section header classes', () => {
      const classes = getAdminCategoryHeaderClasses();
      expect(classes).toContain('uppercase');
      expect(classes).toContain('font-mono-tight');
      expect(classes).toContain('text-mist-2/70');
    });
  });`;
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t18));
commit('test(admin-nav): add unit tests for getAdminCategoryHeaderClasses styling invariants');

// Test 19: getAdminNavLinkClasses
const t19 = t18.replace(
  /    it\('provides clean uppercase section header classes', \(\) => \{[\s\S]*?\}\);/,
  `$&

    it('provides active styling with primary background and secondary text', () => {
      const activeCls = getAdminNavLinkClasses(true);
      expect(activeCls).toContain('bg-primary/20');
      expect(activeCls).toContain('text-secondary');
      expect(activeCls).toContain('font-medium');

      const inactiveCls = getAdminNavLinkClasses(false);
      expect(inactiveCls).toContain('text-mist-1');
      expect(inactiveCls).toContain('hover:text-paper');
    });`
);
fs.writeFileSync('tests/unit/admin-nav.test.ts', buildTest(t19));
commit('test(admin-nav): add unit tests for getAdminNavLinkClasses active and inactive classes');

// Test 20: getAdminBadgeClasses and restore full test file from backup
fs.copyFileSync(path.join(scratchDir, 'admin-nav.test.ts.bak'), 'tests/unit/admin-nav.test.ts');
commit('test(admin-nav): add unit tests for getAdminBadgeClasses badge variant styles');

console.log('ALL CATEGORIZED ADMIN NAV COMMITS SUCCESSFULLY EXECUTED!');
