import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="max-w-md mx-auto p-4 py-8 space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  )
}