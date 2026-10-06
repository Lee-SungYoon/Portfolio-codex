import Link from "next/link";

const navItems = [
  { label: "WORK", href: "/#work" },
  { label: "ABOUT", href: "/#about" },
];

export default function Header() {
  return (
    <header className="site-header reveal">
      <Link className="brand" href="/" aria-label="Lee. Sung Yoon home">
        SY ARCHIVE
      </Link>

      <nav className="top-links" aria-label="Primary menu">
        {navItems.map((item) => (
          <Link className="text-link" href={item.href} key={item.label}>
            {item.label}
          </Link>
        ))}
        <Link className="talk-button" href="/#contact">
          MESSAGE
        </Link>
      </nav>
    </header>
  );
}
