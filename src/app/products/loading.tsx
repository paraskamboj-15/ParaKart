import { ProductGridSkeleton, Skeleton } from "@/components/skeletons";

export default function ProductsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-24 sm:px-8">
      <div className="pt-10 pb-8 sm:pt-14">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-4 h-12 w-72 sm:h-16" />
        <Skeleton className="mt-3 h-4 w-40" />
      </div>
      <div className="flex items-center gap-3 border-y border-line py-4">
        <Skeleton className="h-11 max-w-sm flex-1 rounded-full" />
        <Skeleton className="h-11 w-44 rounded-full" />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[230px_1fr]">
        <div className="hidden space-y-2 lg:block">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-xl" />
          ))}
        </div>
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
