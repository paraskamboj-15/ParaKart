"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
      className="flex max-w-md items-center gap-2 rounded-full border border-cream/20 bg-cream/5 p-1.5"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setDone(false);
        }}
        placeholder="Email address"
        className="w-full bg-transparent px-4 text-sm text-cream outline-none placeholder:text-cream/40"
      />
      <button
        type="submit"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-clay text-cream transition-colors hover:bg-cream hover:text-ink"
        aria-label="Subscribe"
      >
        {done ? <Check size={16} /> : <ArrowRight size={16} />}
      </button>
    </form>
  );
}
