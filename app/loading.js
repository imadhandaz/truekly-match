export default function Loading() {
  return (
    <div className="flex flex-col flex-1 min-h-screen pb-24 animate-pulse">
      <div className="sticky top-0 z-20 w-full px-5 py-4 flex items-center justify-between bg-background/70 border-b border-foreground/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-foreground/10" />
          <div className="space-y-1.5">
            <div className="h-4 w-28 rounded-full bg-foreground/10" />
            <div className="h-2.5 w-20 rounded-full bg-foreground/10" />
          </div>
        </div>
        <div className="h-8 w-16 rounded-full bg-foreground/10" />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pt-6">
        <div className="w-full max-w-sm">
          <div className="aspect-[3/4] rounded-3xl bg-foreground/10 shadow-xl" />
          <div className="flex justify-center gap-6 mt-6">
            {[0,1,2].map(i => <div key={i} className="w-14 h-14 rounded-full bg-foreground/10" />)}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background/70 border-t border-foreground/5 flex items-center justify-around px-8">
        {[0,1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-foreground/10" />)}
      </div>
    </div>
  );
}
