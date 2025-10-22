import type { ReactNode } from "react";

interface LayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function Layout({ title, description, children }: LayoutProps): JSX.Element {
  return (
    <section className="layout-shell flex flex-col gap-8 py-12 sm:py-16">
      {(title || description) && (
        <div className="max-w-3xl space-y-3">
          {title && (
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
          )}
          {description && <p className="text-base leading-relaxed text-muted">{description}</p>}
        </div>
      )}
      <div className="surface-card space-y-6">
        {children}
      </div>
    </section>
  );
}
