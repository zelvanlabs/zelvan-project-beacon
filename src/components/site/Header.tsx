import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "How we work" },
  { href: "#work", label: "Work" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-chalk/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <a href="#top" className="flex items-center gap-2 text-xl" aria-label="Zelvan Labs, back to top">
          <Logo size={22} />
          <Wordmark />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[0.95rem] hover:text-verdigris">
              {l.label}
            </a>
          ))}
          <Button asChild>
            <a href="#contact">Start a project</a>
          </Button>
        </nav>
        <button
          type="button"
          className="p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-mist px-5 pb-6 md:hidden">
          <ul>
            {links.map((l) => (
              <li key={l.href} className="border-b border-mist">
                <a href={l.href} onClick={() => setOpen(false)} className="block py-4 text-2xl font-bold tracking-tight">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-6 w-full">
            <a href="#contact" onClick={() => setOpen(false)}>Start a project</a>
          </Button>
        </nav>
      )}
    </header>
  );
}
