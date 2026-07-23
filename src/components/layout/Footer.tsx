import { Mail, Rss, LayoutGrid } from "lucide-react";

const LINKS = [
  { label: "Contacto", href: "https://aitor-blog-contacto.vercel.app", icon: Mail },
  { label: "Blog", href: "https://aitorsanchez.pages.dev", icon: Rss },
  { label: "Más apps", href: "https://aitorhub.vercel.app", icon: LayoutGrid },
];

export function Footer() {
  return (
    <footer className="flex h-9 shrink-0 items-center justify-between gap-3 border-t border-neutral-800 bg-neutral-950 px-3 text-[11px] text-neutral-500 lg:px-4">
      <p className="truncate">
        © 2026{" "}
        <span className="text-neutral-400">Aitor Sánchez Gutiérrez</span> · Reservados
        todos los derechos
      </p>
      <nav className="flex shrink-0 items-center gap-3">
        {LINKS.map(({ label, href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-neutral-500 transition-colors hover:text-amber-400"
          >
            <Icon className="size-3" />
            <span className="hidden sm:inline">{label}</span>
          </a>
        ))}
      </nav>
    </footer>
  );
}
