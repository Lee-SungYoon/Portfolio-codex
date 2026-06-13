"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isWorks = pathname === "/works";
  const navItems = [
    { label: "HOME", href: "/" },
    { label: "WORK", href: "/works" },
    { label: "ABOUT", href: "/about" },
  ];

  return (
    <header className={`site-header reveal${isAbout ? " site-header--dark" : ""}${isWorks ? " site-header--works" : ""}`}>
      <Link className={`header-cta${isAbout ? " header-cta--light" : ""}`} href="#contact">
        MASSAGE
      </Link>

      <nav className="top-links" aria-label="Primary menu">
        {navItems.map((item) => (
          <Link className="text-link" href={item.href} key={item.label}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
