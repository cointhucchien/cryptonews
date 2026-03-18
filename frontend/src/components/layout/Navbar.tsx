"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

const NAV_LINKS = [
  { href: "/",          label: "Trang chủ" },
  { href: "/news",      label: "Tin tức" },
  { href: "/airdrops",  label: "Airdrop" },
  { href: "/prices",    label: "Giá coin" },
  { href: "/search",    label: "Tìm kiếm" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            Crypto<span className="text-brand">News</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "nav-link",
                pathname === link.href && "active"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400
                       hover:bg-gray-700 hover:text-white transition-colors text-sm"
          >
            <Search size={14} />
            <span>Tìm kiếm...</span>
            <kbd className="ml-1 text-xs bg-gray-700 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "nav-link text-base py-1",
                pathname === link.href && "active"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
