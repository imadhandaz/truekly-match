// Skeleton loading components

export function CardSkeleton() {
  return (
    <div className="relative w-full max-w-sm mx-auto animate-pulse" style={{ aspectRatio: "3/4.6" }}>
      <div className="absolute inset-0 rounded-3xl bg-foreground/10" />
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
        <div className="h-8 w-2/3 rounded-xl bg-foreground/15" />
        <div className="h-4 w-1/2 rounded-lg bg-foreground/10" />
        <div className="h-14 rounded-xl bg-foreground/10" />
      </div>
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="aspect-[3/4] rounded-2xl bg-foreground/10 animate-pulse" />
  );
}

export function ChatRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-14 h-14 rounded-full bg-foreground/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded-lg bg-foreground/10" />
        <div className="h-3 w-3/4 rounded-lg bg-foreground/8" />
      </div>
    </div>
  );
}

export function ProfileProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[0, 1].map((i) => (
        <div key={i} className="aspect-[3/4] rounded-2xl bg-foreground/10 animate-pulse" />
      ))}
    </div>
  );
}
