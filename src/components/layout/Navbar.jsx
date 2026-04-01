import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, COMPANY } from "../../data/siteData";
import Button from "../ui/Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On homepage: navbar starts transparent over the dark hero,
  // then solidifies on scroll. On other pages: always solid.
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 dark:bg-surface-900/95 backdrop-blur-md shadow-lg shadow-black/[0.04] dark:shadow-black/20"
      }`}
    >
      {/* Thin accent line — hidden when transparent */}
      <div
        className={`h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 transition-opacity duration-300 ${
          isTransparent ? "opacity-0" : "opacity-100"
        }`}
      />

      <nav className="container-max flex items-center justify-between h-16 lg:h-[72px] px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20">
            <span className="text-white font-heading font-extrabold text-sm tracking-tight">
              {COMPANY.shortName}
            </span>
          </div>
          <div className="leading-none">
            <span
              className={`font-heading font-extrabold text-lg tracking-tight transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-surface-900 dark:text-white"
              }`}
            >
              {COMPANY.name.split(" ")[0].toUpperCase()}
            </span>
            <span
              className={`block text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 ${
                isTransparent ? "text-slate-400" : "text-primary-500 dark:text-primary-400"
              }`}
            >
              {COMPANY.name.split(" ")[1]}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? isTransparent
                      ? "text-white bg-white/10"
                      : "text-primary-500 bg-primary-50 dark:bg-primary-500/10"
                    : isTransparent
                      ? "text-white/70 hover:text-white hover:bg-white/5"
                      : "text-surface-800 dark:text-white/70 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-surface-50 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            href="/quote"
            variant="accent"
            id="nav-get-quote-cta"
            className="text-sm px-5 py-2.5"
          >
            Get a Quote
          </Button>
        </div>

        {/* Mobile: Menu Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            className={`p-2 -mr-2 rounded-lg transition-colors ${
              isTransparent
                ? "text-white hover:bg-white/10"
                : "text-surface-800 dark:text-white hover:bg-surface-50 dark:hover:bg-white/5"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-surface-100 dark:border-white/10 bg-white dark:bg-surface-900 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium
                  ${
                    location.pathname === link.href
                      ? "text-primary-500 bg-primary-50 dark:bg-primary-500/10"
                      : "text-surface-800 dark:text-white/70 hover:bg-surface-50 dark:hover:bg-white/5"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-surface-100 dark:border-white/10 mt-3">
              <Button
                href="/quote"
                variant="accent"
                id="nav-mobile-get-quote-cta"
                className="w-full text-sm"
              >
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
