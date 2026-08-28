import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-5 py-28 text-center sm:px-8">
      <span className="flex size-20 items-center justify-center rounded-full bg-parchment">
        <Compass size={30} className="text-clay" />
      </span>
      <p className="mt-8 font-display text-7xl font-semibold tracking-tight sm:text-8xl">
        404
      </p>
      <h1 className="mt-3 font-display text-2xl">Lost in the catalogue</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
        The page you&rsquo;re after doesn&rsquo;t exist — but 194 very good
        products do.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn-primary">
          Browse products <ArrowRight size={15} />
        </Link>
        <Link href="/" className="btn-ghost">
          Back home
        </Link>
      </div>
    </div>
  );
}
