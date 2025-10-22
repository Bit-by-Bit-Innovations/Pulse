import { Layout } from "@/components/Layout";

const highlights = [
  {
    title: "Product pulse",
    description:
      "Monitor sentiment, adoption, and engagement from a single, unified dashboard that feels as calm as it looks."
  },
  {
    title: "Team rituals",
    description:
      "Align weekly around shared momentum with curated updates and guided reflections tailored for product teams."
  },
  {
    title: "Signals & stories",
    description:
      "Transform raw signals into narratives that spark action and help teams move forward together."
  }
];

export default function HomePage(): JSX.Element {
  return (
    <Layout
      title="Welcome to Pulse"
      description="This base shell sets the tone for a calm, focused product experience. Build on top of it to craft thoughtful surfaces and interactions."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="surface-muted flex h-full flex-col gap-3 rounded-2xl"
          >
            <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{item.description}</p>
          </article>
        ))}
        <aside className="surface-muted flex h-full flex-col justify-between gap-4 rounded-2xl sm:col-span-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted">
              roadmap
            </p>
            <p className="text-sm text-muted">
              This space is ready for your widgets, charts, and insights. Extend the layout by composing additional
              surfaces and sections that match your product journey.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="rounded-full bg-surface px-3 py-1 shadow-subtle">Tailwind foundation</span>
            <span className="rounded-full bg-surface px-3 py-1 shadow-subtle">Lexend typeface</span>
            <span className="rounded-full bg-surface px-3 py-1 shadow-subtle">Soft UI shell</span>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
