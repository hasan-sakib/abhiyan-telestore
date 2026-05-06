import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div>
        <p className="label-caps text-primary mb-2">{eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-on-surface">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-on-surface-variant mt-2 max-w-xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
