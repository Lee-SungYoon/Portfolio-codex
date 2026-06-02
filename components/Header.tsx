"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const links = [
    { href: "/works", label: "Works Works Works" },
    { href: "/about", label: "About About About" },
    { href: "/install", label: "Install Install Install" },
  ];

  return (
    <header className="site-header">
      <Link href="/" className="brand-mark" aria-label="SY Archive home">
        <span>SY</span>
      </Link>
      <nav className="header-nav" aria-label="Main navigation">
        {links.map(({ href, label }) => (
          <Link className={pathname.startsWith(href) ? "active" : ""} href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
