export default function DesignSystemLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-br from-primary/10 via-secondary/10 to-background py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4">
            <div className="h-12 w-2/3 mx-auto bg-muted animate-pulse rounded-lg" />
            <div className="h-6 w-1/2 mx-auto bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
