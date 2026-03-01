export default function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-muted-foreground text-lg">{subtitle}</p>
      )}
      <div className="mt-4 h-1 w-16 bg-primary rounded-full" />
    </div>
  );
}
