"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnimatePresence, motion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Brand } from "@/components/brand";

const navItems = [
  { href: "/markets", label: "Markets" },
  { href: "/app", label: "Terminal" },
  { href: "/positions", label: "Positions" },
  { href: "/activity", label: "Activity" },
  { href: "/docs", label: "Docs" }
];

function isNavItemActive(pathname: string, href: string) {
  return pathname === href || (href === "/app" && pathname.startsWith("/app"));
}

export function AppNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <motion.nav
      className={`app-nav${menuOpen ? " app-nav--menu-open" : ""}`}
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href="/" aria-label="Keepx home" className="app-nav-brand">
        <Brand />
      </Link>

      <div className="nav-links">
        {navItems.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "text-white font-semibold bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 shadow-sm" : "hover:text-white transition-colors"}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="app-nav-end">
        <button
          type="button"
          className="nav-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="app-nav-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
        <div className="nav-actions">
          <WalletMultiButton />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            id="app-nav-mobile-menu"
            className="nav-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {navItems.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-mobile-link${isActive ? " is-active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  );
}
