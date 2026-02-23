'use client';

import { StarIcon, UserIcon } from '@/common/components/icons';
import { cn } from '@/common/utils/cn';

type TestimonialCardProps = {
  name: string;
  role: string;
  quote: string;
  delay?: number;
};

export function TestimonialCard({
  name,
  role,
  quote,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'glass-panel flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:bg-[var(--glass-highlight)]',
        'fade-in-up' // Assuming this animation class exists or handled by parent
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="space-y-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
          ))}
        </div>
        <p className="text-sm leading-relaxed text-[var(--text-primary)]">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-soft)]">
          <UserIcon className="h-5 w-5 text-[var(--text-muted)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {name}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{role}</p>
        </div>
      </div>
    </div>
  );
}
