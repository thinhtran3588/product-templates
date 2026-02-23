import { Link } from '@/common/routing/navigation';

type MainFooterProps = {
  privacyLabel: string;
  privacyHref: string;
  termsLabel: string;
  termsHref: string;
  copyright: string;
};

export function MainFooter({
  privacyLabel,
  privacyHref,
  termsLabel,
  termsHref,
  copyright,
}: MainFooterProps) {
  return (
    <footer className="relative z-10 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-[24px] backdrop-saturate-[1.8]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href={privacyHref}
            className="text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
          >
            {privacyLabel}
          </Link>
          <Link
            href={termsHref}
            className="text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
          >
            {termsLabel}
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
