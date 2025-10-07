export default function EditComponentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-background dark:from-background dark:via-purple-950/10">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-32 bg-muted rounded mb-4 animate-pulse" />
          <div className="flex items-center justify-between">
            <div>
              <div className="h-10 w-64 bg-muted rounded mb-2 animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg border p-6 space-y-4">
                <div className="h-6 w-40 bg-muted rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-10 w-full bg-muted rounded animate-pulse" />
                  <div className="h-20 w-full bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="h-6 w-40 bg-muted rounded animate-pulse" />
              <div className="h-48 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="h-6 w-40 bg-muted rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
