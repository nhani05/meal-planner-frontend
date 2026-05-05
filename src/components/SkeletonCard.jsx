export const SkeletonCard = ({ count = 1, className = '' }) => (
  <div className={`grid gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border bg-card p-4 space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-8 w-8 rounded bg-slate-200" />
        </div>
        <div className="h-8 w-20 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
      </div>
    ))}
  </div>
);

export const SkeletonGrid = ({ count = 4, cols = 'sm:grid-cols-2 lg:grid-cols-4' }) => (
  <div className={`grid gap-4 ${cols}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border bg-card p-4 space-y-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-8 w-8 rounded bg-slate-200" />
        </div>
        <div className="h-8 w-20 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
      </div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="border rounded-md animate-pulse">
    <div className="bg-slate-50 p-3 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 flex-1 rounded bg-slate-200" />
      ))}
    </div>
    <div className="divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-3 flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 rounded bg-slate-200" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonImageCard = ({ count = 4 }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border bg-card overflow-hidden animate-pulse">
        <div className="aspect-video bg-slate-200" />
        <div className="p-4 space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
        </div>
      </div>
    ))}
  </div>
);
