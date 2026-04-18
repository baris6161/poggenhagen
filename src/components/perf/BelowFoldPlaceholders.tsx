/** Minimale Platzhalter für `next/dynamic` (Kader, Instagram), um CLS zu begrenzen. */
export function SquadSectionSkeleton() {
  return (
    <div
      className="relative py-20 md:py-28 overflow-hidden border-t border-border/20"
      aria-busy="true"
    >
      <span className="sr-only">Kader wird geladen</span>
      <div className="container relative z-10">
        <div className="h-12 w-44 max-w-full bg-muted/50 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-56 rounded-xl bg-card border border-border/40 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function InstagramSectionSkeleton() {
  return (
    <div
      className="relative py-20 md:py-28 overflow-hidden border-t border-border/20"
      aria-busy="true"
    >
      <span className="sr-only">Instagram-Bereich wird geladen</span>
      <div className="container flex flex-col items-center">
        <div className="h-8 w-52 max-w-full bg-muted/50 rounded animate-pulse mb-8" />
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
