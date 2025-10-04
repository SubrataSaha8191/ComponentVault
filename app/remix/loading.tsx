import { Skeleton } from "@/components/ui/skeleton"

export default function RemixLoading() {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar Skeleton */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 border-r bg-card/30 backdrop-blur-sm p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l bg-card/30 backdrop-blur-sm p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
