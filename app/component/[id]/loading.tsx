export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-white/5 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
            <div className="space-y-6">
              <div className="h-64 bg-white/5 rounded-lg" />
              <div className="h-32 bg-white/5 rounded-lg" />
              <div className="h-96 bg-white/5 rounded-lg" />
            </div>
            <div className="space-y-6">
              <div className="h-96 bg-white/5 rounded-lg" />
              <div className="h-64 bg-white/5 rounded-lg" />
              <div className="h-96 bg-white/5 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
