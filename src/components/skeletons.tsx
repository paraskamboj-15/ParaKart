import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-parchment border border-line/50",
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 py-10">
      <Skeleton className="h-4 w-56" />
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
