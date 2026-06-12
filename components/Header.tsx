"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const isWorks = pathname === "/works";
  const navItems = [
    { label: "WORK", href: "/works" },
    { label: "ABOUT", href: "/about" },
  ];

  return (
    <header className={`site-header reveal${isAbout ? " site-header--dark" : ""}${isWorks ? " site-header--works" : ""}`}>
      <Link className="brand" href="/" aria-label="Lee. Sung Yoon home">
        SY ARCHIVE
      </Link>

      <nav className="top-links" aria-label="Primary menu">
        {navItems.map((item) => (
          <Link className="text-link" href={item.href} key={item.label}>
            {item.label}
          </Link>
        ))}
        <Link className={`talk-button${isAbout ? " talk-button--light" : ""}`} href="#contact">
          MESSAGE
        </Link>
      </nav>
    </header>
  );
}
