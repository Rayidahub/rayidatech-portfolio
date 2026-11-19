const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scratchDir = 'C:/Users/user/.gemini/antigravity/brain/76f17175-353f-481e-9c3e-f30580e988d2/scratch';

function commit(msg) {
  execSync('git add -A', { stdio: 'inherit' });
  execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
  console.log(`[COMMITTED] ${msg}`);
}

// 2. components/layout/Navbar.tsx (7 atomic commits)
let origNav = fs.readFileSync('components/layout/Navbar.tsx', 'utf8').replace(/\r\n/g, '\n');

// Commit 7: replace navLinks definition with imports
const targetImports = `const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];`;
const replaceImports = `import {
  MAIN_NAV_LINKS,
  isNavActive,
  getNavbarContainerClasses,
  getMobileMenuDrawerClasses,
  getMobileBackdropClasses,
  getMobileNavLinkClasses,
} from '@/lib/navbar';`;
let navStep1 = origNav.replace(targetImports, replaceImports);
fs.writeFileSync('components/layout/Navbar.tsx', navStep1);
commit('refactor(navbar): import navbar helper functions in components/layout/Navbar.tsx');

// Commit 8: body scroll locking effect
const targetEffect = `  useEffect(() => {
    const timeout = window.setTimeout(() => setIsOpen(false), 0);
    return () => window.clearTimeout(timeout);
  }, [pathname]);`;
const replaceEffectScroll = `  useEffect(() => {
    const timeout = window.setTimeout(() => setIsOpen(false), 0);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);`;
let navStep2 = navStep1.replace(targetEffect, replaceEffectScroll);
fs.writeFileSync('components/layout/Navbar.tsx', navStep2);
commit('feat(navbar): add body scroll locking effect when mobile menu is open');

// Commit 9: Escape key event listener
const replaceEffectEsc = `  useEffect(() => {
    const timeout = window.setTimeout(() => setIsOpen(false), 0);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  // Lock body scroll and listen for Escape when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);`;
let navStep3 = navStep2.replace(replaceEffectScroll, replaceEffectEsc);
fs.writeFileSync('components/layout/Navbar.tsx', navStep3);
commit('feat(navbar): add Escape key keyboard event listener for menu dismissal');

// Commit 10: bind getNavbarContainerClasses
const targetNavTag = `<nav
      className={\`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 \${
        scrolled ? 'glass' : 'border-b border-transparent'
      }\`}
    >`;
const replaceNavTag = `<nav className={getNavbarContainerClasses({ isOpen, scrolled })}>`;
let navStep4 = navStep3.replace(targetNavTag, replaceNavTag);
fs.writeFileSync('components/layout/Navbar.tsx', navStep4);
commit('feat(navbar): bind getNavbarContainerClasses to nav element for opaque open state');

// Commit 11: desktop navigation links
const targetDesktop = `{navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={\`text-sm transition-colors \${
                  active ? 'text-paper' : 'text-mist-1 hover:text-paper'
                }\`}
              >
                {link.label}
              </Link>
            );
          })}`;
const replaceDesktop = `{MAIN_NAV_LINKS.map((link) => {
            const active = isNavActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={\`text-sm transition-colors \${
                  active ? 'text-paper font-semibold' : 'text-mist-1 hover:text-paper'
                }\`}
              >
                {link.label}
              </Link>
            );
          })}`;
let navStep5 = navStep4.replace(targetDesktop, replaceDesktop);
fs.writeFileSync('components/layout/Navbar.tsx', navStep5);
commit('feat(navbar): update desktop navigation links to use MAIN_NAV_LINKS and isNavActive');

// Commit 12: mobile hamburger button styling
const targetButton = `className="p-2 -mr-1.5 rounded-xl text-mist-1 transition-colors hover:text-paper hover:bg-paper/5 md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"`;
const replaceButton = `className={\`p-2 -mr-1.5 rounded-xl transition-colors md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer \${
            isOpen
              ? 'text-paper bg-white/10 hover:bg-white/15'
              : 'text-mist-1 hover:text-paper hover:bg-white/5'
          }\`}`;
let navStep6 = navStep5.replace(targetButton, replaceButton);
fs.writeFileSync('components/layout/Navbar.tsx', navStep6);
commit('feat(navbar): style mobile hamburger toggle button with active contrast indicators');

// Commit 13: deploy full Navbar.tsx from backup
fs.copyFileSync(path.join(scratchDir, 'Navbar.tsx.bak'), 'components/layout/Navbar.tsx');
commit('feat(navbar): deploy solid opaque mobile drawer and backdrop overlay system');


// ==========================================
// 3. AGENTS.md (2 atomic commits)
// ==========================================

const agentsOriginal = fs.readFileSync('AGENTS.md', 'utf8').replace(/\r\n/g, '\n');
const targetPrimitives = `- \`lib/slug.ts\` — \`normalizeSlug(title)\`, URL-safe slug generator.
- \`lib/reading-time.ts\` — \`getReadingTime(content)\`, used on blog pages.
- \`lib/email/index.ts\` — Transactional email service (Resend REST API).`;
const replacePrimitives = `- \`lib/reading-time.ts\` — \`getReadingTime(content)\`, used on blog pages.
- \`lib/slug.ts\` — \`normalizeSlug(title)\`, URL-safe slug generator.
- \`lib/navbar.ts\` — \`MAIN_NAV_LINKS\`, \`isNavActive\`, \`getNavbarContainerClasses\`, \`getMobileMenuDrawerClasses\`, \`getMobileBackdropClasses\`, \`getMobileNavLinkClasses\`.
- \`lib/email/index.ts\` — Transactional email service (Resend REST API).`;
let agentsStep1 = agentsOriginal.replace(targetPrimitives, replacePrimitives);
fs.writeFileSync('AGENTS.md', agentsStep1);
commit('docs(agents): register lib/navbar.ts in AGENTS.md shared primitives');

fs.copyFileSync(path.join(scratchDir, 'AGENTS.md.bak'), 'AGENTS.md');
commit('docs(agents): document mobile hamburger menu opaque architecture in AGENTS.md');


// ==========================================
// 4. tests/unit/navbar.test.ts (20 atomic commits)
// ==========================================

function buildTestContent(sections) {
  return `import { describe, it, expect } from 'vitest';
import {
  MAIN_NAV_LINKS,
  isNavActive,
  getNavbarContainerClasses,
  getMobileMenuDrawerClasses,
  getMobileBackdropClasses,
  getMobileNavLinkClasses,
} from '@/lib/navbar';

describe('Navbar System & Mobile Menu Opaque Architecture', () => {
${sections.join('\n\n')}
});
`;
}

const sMainNavLinks = [
  `    it('defines the complete standard set of 6 main navigation links', () => {
      expect(MAIN_NAV_LINKS).toHaveLength(6);
    });`,
  `    it('contains the expected canonical navigation routes', () => {
      const labels = MAIN_NAV_LINKS.map((l) => l.label);
      expect(labels).toEqual([
        'About',
        'Projects',
        'Services',
        'Products',
        'Blog',
        'Contact',
      ]);
    });`,
  `    it('ensures all links have valid absolute path hrefs starting with /', () => {
      for (const link of MAIN_NAV_LINKS) {
        expect(link.href.startsWith('/')).toBe(true);
        expect(link.href).not.toBe('');
      }
    });`,
  `    it('includes /products in the main navigation list', () => {
      const productLink = MAIN_NAV_LINKS.find((l) => l.href === '/products');
      expect(productLink).toBeDefined();
      expect(productLink?.label).toBe('Products');
    });`,
];

const sIsNavActive = [
  `    it('accurately identifies active root path', () => {
      expect(isNavActive('/', '/')).toBe(true);
      expect(isNavActive('/about', '/')).toBe(false);
    });`,
  `    it('accurately identifies exact route match', () => {
      expect(isNavActive('/about', '/about')).toBe(true);
      expect(isNavActive('/projects', '/projects')).toBe(true);
      expect(isNavActive('/contact', '/contact')).toBe(true);
    });`,
  `    it('identifies nested subpath routes as active for parent link', () => {
      expect(isNavActive('/projects/luxe-by-sey', '/projects')).toBe(true);
      expect(isNavActive('/blog/understanding-design-systems', '/blog')).toBe(true);
      expect(isNavActive('/services/brand-identity', '/services')).toBe(true);
    });`,
  `    it('does not falsely activate on partial slug substrings', () => {
      expect(isNavActive('/products-and-services', '/products')).toBe(false);
      expect(isNavActive('/about-us', '/about')).toBe(false);
    });`,
  `    it('returns false when routes do not match', () => {
      expect(isNavActive('/services', '/projects')).toBe(false);
      expect(isNavActive('/contact', '/about')).toBe(false);
    });`,
];

const sGetNavbarContainerClasses = [
  `    it('always includes fixed positioning and z-50', () => {
      const closedNormal = getNavbarContainerClasses({ isOpen: false, scrolled: false });
      const closedScrolled = getNavbarContainerClasses({ isOpen: false, scrolled: true });
      const openNormal = getNavbarContainerClasses({ isOpen: true, scrolled: false });
      const openScrolled = getNavbarContainerClasses({ isOpen: true, scrolled: true });

      for (const cls of [closedNormal, closedScrolled, openNormal, openScrolled]) {
        expect(cls).toContain('fixed top-0 left-0 right-0 z-50');
      }
    });`,
  `    it('applies completely solid bg-[var(--ink-deep)] when mobile menu is open, regardless of scroll', () => {
      const openClasses = getNavbarContainerClasses({ isOpen: true, scrolled: false });
      expect(openClasses).toContain('bg-[var(--ink-deep)]');
      expect(openClasses).toContain('border-b border-(--line)');
      expect(openClasses).toContain('shadow-2xl');
      expect(openClasses).not.toContain('glass');

      const openScrolledClasses = getNavbarContainerClasses({ isOpen: true, scrolled: true });
      expect(openScrolledClasses).toContain('bg-[var(--ink-deep)]');
      expect(openScrolledClasses).not.toContain('glass');
    });`,
  `    it('applies glass effect when closed and scrolled', () => {
      const classes = getNavbarContainerClasses({ isOpen: false, scrolled: true });
      expect(classes).toContain('glass');
      expect(classes).not.toContain('bg-[var(--ink-deep)]');
    });`,
  `    it('applies transparent border when closed and at the top', () => {
      const classes = getNavbarContainerClasses({ isOpen: false, scrolled: false });
      expect(classes).toContain('border-b border-transparent');
      expect(classes).not.toContain('glass');
      expect(classes).not.toContain('bg-[var(--ink-deep)]');
    });`,
];

const sGetMobileMenuDrawerClasses = [
  `    it('provides a completely solid 100% opaque background matching the Rayida ink theme', () => {
      const classes = getMobileMenuDrawerClasses();
      expect(classes).toContain('bg-[var(--ink-deep)]');
    });`,
  `    it('strictly avoids glass and glass-strong to prevent transparent background bleeding', () => {
      const classes = getMobileMenuDrawerClasses();
      expect(classes).not.toContain('glass-strong');
      expect(classes).not.toContain('glass');
    });`,
  `    it('contains top and bottom borders with token-based line color', () => {
      const classes = getMobileMenuDrawerClasses();
      expect(classes).toContain('border-t border-b border-(--line)');
    });

    it('enforces mobile-only visibility with md:hidden', () => {
      const classes = getMobileMenuDrawerClasses();
      expect(classes).toContain('md:hidden');
    });`,
  `    it('provides scrollability and shadow for deep visual separation', () => {
      const classes = getMobileMenuDrawerClasses();
      expect(classes).toContain('overflow-y-auto');
      expect(classes).toContain('shadow-2xl');
    });`,
];

const sGetMobileBackdropClasses = [
  `    it('creates a full-screen dimmed backdrop overlay', () => {
      const classes = getMobileBackdropClasses();
      expect(classes).toContain('fixed inset-0');
      expect(classes).toContain('bg-black/75');
    });

    it('is constrained to mobile viewports with md:hidden', () => {
      const classes = getMobileBackdropClasses();
      expect(classes).toContain('md:hidden');
    });

    it('includes slight blur and entry animation for smooth visual transition', () => {
      const classes = getMobileBackdropClasses();
      expect(classes).toContain('backdrop-blur-sm');
    });`,
];

const sGetMobileNavLinkClasses = [
  `    it('formats active navigation links with primary tint and bold emphasis', () => {
      const activeClasses = getMobileNavLinkClasses(true);
      expect(activeClasses).toContain('text-paper');
      expect(activeClasses).toContain('bg-primary/15');
      expect(activeClasses).toContain('border border-primary/25');
      expect(activeClasses).toContain('font-semibold');
    });`,
  `    it('formats inactive navigation links with muted colors and subtle hover styling', () => {
      const inactiveClasses = getMobileNavLinkClasses(false);
      expect(inactiveClasses).toContain('text-mist-1');
      expect(inactiveClasses).toContain('hover:text-paper');
      expect(inactiveClasses).toContain('hover:bg-white/5');
      expect(inactiveClasses).not.toContain('bg-primary/15');
    });`,
];

// Commit 16: Setup and length test
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.slice(0, 1).join('\n\n')}\n  });`
]));
commit('test(navbar): setup unit test suite and verify MAIN_NAV_LINKS link count');

// Commit 17
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.slice(0, 2).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for MAIN_NAV_LINKS canonical route labels');

// Commit 18
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.slice(0, 3).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for MAIN_NAV_LINKS absolute path hrefs');

// Commit 19
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests verifying presence of /products in MAIN_NAV_LINKS');

// Commit 20
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.slice(0, 1).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for isNavActive root path handling');

// Commit 21
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.slice(0, 2).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for isNavActive exact path matching');

// Commit 22
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.slice(0, 3).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for isNavActive nested route and subpath handling');

// Commit 23
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.slice(0, 4).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests verifying isNavActive rejects partial slug prefixes');

// Commit 24
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for isNavActive non-matching routes');

// Commit 25
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.slice(0, 1).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for getNavbarContainerClasses fixed positioning');

// Commit 26
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.slice(0, 2).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for getNavbarContainerClasses solid ink-deep on open');

// Commit 27
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.slice(0, 3).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for getNavbarContainerClasses glass class on scroll');

// Commit 28
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for getNavbarContainerClasses transparent border when closed');

// Commit 29
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.join('\n\n')}\n  });`,
  `  describe('getMobileMenuDrawerClasses', () => {\n${sGetMobileMenuDrawerClasses.slice(0, 1).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for getMobileMenuDrawerClasses solid ink-deep background');

// Commit 30
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.join('\n\n')}\n  });`,
  `  describe('getMobileMenuDrawerClasses', () => {\n${sGetMobileMenuDrawerClasses.slice(0, 2).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests asserting absence of glass and glass-strong in mobile drawer');

// Commit 31
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.join('\n\n')}\n  });`,
  `  describe('getMobileMenuDrawerClasses', () => {\n${sGetMobileMenuDrawerClasses.slice(0, 3).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for getMobileMenuDrawerClasses token borders and md:hidden');

// Commit 32
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.join('\n\n')}\n  });`,
  `  describe('getMobileMenuDrawerClasses', () => {\n${sGetMobileMenuDrawerClasses.join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for mobile drawer scrollability and shadow classes');

// Commit 33
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.join('\n\n')}\n  });`,
  `  describe('getMobileMenuDrawerClasses', () => {\n${sGetMobileMenuDrawerClasses.join('\n\n')}\n  });`,
  `  describe('getMobileBackdropClasses', () => {\n${sGetMobileBackdropClasses.join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for getMobileBackdropClasses overlay dimensions and blur');

// Commit 34
fs.writeFileSync('tests/unit/navbar.test.ts', buildTestContent([
  `  describe('MAIN_NAV_LINKS', () => {\n${sMainNavLinks.join('\n\n')}\n  });`,
  `  describe('isNavActive', () => {\n${sIsNavActive.join('\n\n')}\n  });`,
  `  describe('getNavbarContainerClasses', () => {\n${sGetNavbarContainerClasses.join('\n\n')}\n  });`,
  `  describe('getMobileMenuDrawerClasses', () => {\n${sGetMobileMenuDrawerClasses.join('\n\n')}\n  });`,
  `  describe('getMobileBackdropClasses', () => {\n${sGetMobileBackdropClasses.join('\n\n')}\n  });`,
  `  describe('getMobileNavLinkClasses', () => {\n${sGetMobileNavLinkClasses.slice(0, 1).join('\n\n')}\n  });`
]));
commit('test(navbar): add unit tests for getMobileNavLinkClasses active state styling');

// Commit 35
fs.copyFileSync(path.join(scratchDir, 'navbar.test.ts.bak'), 'tests/unit/navbar.test.ts');
commit('test(navbar): add unit tests for getMobileNavLinkClasses inactive state styling');

console.log('ALL ATOMIC COMMITS SUCCESSFULLY EXECUTED!');
