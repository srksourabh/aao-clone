import { cn } from "@/lib/utils"

/**
 * Skeleton Component
 *
 * A loading placeholder that mimics the shape of content while loading.
 * Used to improve perceived performance and reduce layout shift.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

/**
 * Booking Card Skeleton
 * Used in my-bookings page while loading bookings
 */
function BookingCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 md:p-6 space-y-4 bg-white">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  )
}

/**
 * Booking Details Skeleton
 * Used in booking/[id] page while loading
 */
function BookingDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Skeleton className="h-16 w-full rounded-lg" />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4 bg-white">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4 bg-white">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="border rounded-lg p-6 space-y-4 bg-white">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Table Row Skeleton
 * Used in admin dashboard while loading
 */
function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="bg-white">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

/**
 * Form Skeleton
 * Generic form placeholder
 */
function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 mt-6" />
    </div>
  )
}

export {
  Skeleton,
  BookingCardSkeleton,
  BookingDetailsSkeleton,
  TableRowSkeleton,
  FormSkeleton,
}
