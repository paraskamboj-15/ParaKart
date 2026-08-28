import Link from "next/link";
import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

const VALUE_PROPS = [
  { icon: Truck, title: "Free shipping", text: "On every order over $50" },
  { icon: RotateCcw, title: "30-day returns", text: "No questions asked" },
  { icon: ShieldCheck, title: "2-year warranty", text: "On selected goods" },
  { icon: CreditCard, title: "Secure checkout", text: "256-bit encrypted" },
];

const SHOP_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "Smartphones", href: "/products?category=smartphones" },
  { label: "Laptops", href: "/products?category=laptops" },
  { label: "Beauty", href: "/products?category=beauty" },
  { label: "Home Decoration", href: "/products?category=home-decoration" },
  { label: "Watches", href: "/products?category=mens-watches" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      {/* Value props */}
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-8 border-b border-cream/10 px-5 py-12 sm:px-8 lg:grid-cols-4">
        {VALUE_PROPS.map((v) => (
          <div key={v.title} className="flex items-start gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cream/15 bg-cream/5">
              <v.icon size={16} className="text-clay" />
            </span>
            <div>
              <p className="text-sm font-semibold">{v.title}</p>
              <p className="mt-0.5 text-xs text-cream/50">{v.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Columns */}
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <p className="font-display text-3xl font-semibold tracking-[0.14em]">
            MiniShop
            <span className="ml-1 inline-block size-2 rounded-full bg-clay" />
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/50">
            A small catalogue of very good things — tech, beauty and homeware
            chosen slowly and shipped quickly.
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-cream/40 uppercase">
            Shop
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-cream/70 transition-colors hover:text-clay"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-cream/40 uppercase">
            Company
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {["About", "Stores", "Journal", "Careers", "Contact"].map((l) => (
              <li key={l}>
                <span className="cursor-pointer text-cream/70 transition-colors hover:text-clay">
                  {l}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-cream/40 uppercase">
            The Sunday Scroll
          </p>
          <p className="mt-4 mb-5 text-sm leading-relaxed text-cream/50">
            New drops, restocks and the occasional essay on objects we love.
            Once a week, never more.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-cream/40 sm:flex-row sm:px-8">
          <p>© 2026 MiniShop Studio. All objects deserve good homes.</p>
          <p>
            Demo storefront · Product data by{" "}
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-clay"
            >
              DummyJSON
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
