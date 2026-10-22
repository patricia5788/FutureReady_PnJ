import type { HTMLAttributes, ReactNode } from 'react';
import {
  Activity,
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  Globe2,
  Lightbulb,
  Route as RouteIcon,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { Link, useLocation } from 'wouter';

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Home', icon: Compass },
  { href: '/skills', label: 'My Skills Profile', icon: UserRound },
  { href: '/careers', label: 'Career Matches', icon: BriefcaseBusiness },
  { href: '/roadmap', label: 'My Learning Roadmap', icon: RouteIcon },
  { href: '/sdg-mapping', label: 'SDG Mapping', icon: Globe2 },
  { href: '/trends', label: 'AI Trends & Scenarios', icon: Activity },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="flex items-center gap-3 px-2 mb-10 no-underline text-inherit" data-testid="link-brand">
          <span className="brand-mark">P</span>
          <span className="leading-tight">
            <strong className="block text-[14px] tracking-tight">PivotPath</strong>
            <span className="text-[10px] opacity-60">IT career pathways</span>
          </span>
        </Link>
        <p className="px-3 mb-2 text-[9px] uppercase tracking-[.16em] opacity-50 font-bold">Explore your next</p>
        <nav aria-label="Main navigation" className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="nav-link"
              aria-current={location === href ? 'page' : undefined}
              data-testid={`link-nav-${href === '/' ? 'home' : href.slice(1)}`}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
          <div className="text-[10px] uppercase tracking-[.14em] text-white/50 mb-2">A note on this demo</div>
          <p className="text-[12px] leading-relaxed text-white/80 m-0">Career scores are explainable examples, not hiring predictions.</p>
        </div>
      </aside>
      <div className="main-area">
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="nav-link"
              aria-current={location === href ? 'page' : undefined}
              data-testid={`mobile-link-${href === '/' ? 'home' : href.slice(1)}`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <header className="topbar">
          <div className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))]">A clearer view of what could be next</div>
          <Link href="/skills" className="flex items-center gap-2 no-underline text-[hsl(var(--foreground))] text-[12px] font-bold" data-testid="link-profile-shortcut">
            <span className="w-8 h-8 rounded-full bg-[hsl(var(--secondary))] grid place-items-center text-[hsl(var(--primary))]"><UserRound size={15}/></span>
            Your profile <ChevronRight size={14}/>
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap justify-between items-end gap-5 mb-8">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        <p className="lede">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function InfoNote({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`synthetic-note ${className}`}>{children}</div>;
}

export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-[hsl(var(--primary))] underline underline-offset-2">
      {children}
    </a>
  );
}

export function SourceLabel({ children }: { children: ReactNode }) {
  return <span className="badge !text-[9px] !px-2 !py-1">{children}</span>;
}

export function EmptyProfileCard({ children }: { children: ReactNode }) {
  return <section className="card mt-5" data-testid="empty-profile-state">{children}</section>;
}

export const careerNavigationItems = navItems;

