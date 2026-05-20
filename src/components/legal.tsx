export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl text-navy mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-ink/85 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
