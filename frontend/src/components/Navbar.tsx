import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Navbar = () => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#gallery", label: t("nav.gallery") },
    { href: "#rooms", label: t("nav.rooms") },
    { href: "#amenities", label: t("nav.amenities") },
    { href: "#location", label: t("nav.location") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F5F0EB]/95 backdrop-blur-md shadow-md border-b border-[#E8E0D8]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 lg:px-20">
          {/* Logo */}
          <a
            href="#"
            className={`font-script text-2xl font-bold tracking-wide transition-colors ${
              scrolled ? "text-[#1B3A4B]" : "text-white"
            }`}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Fridrich Apartman
          </a>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-[#1B3A4B]/80 hover:text-[#C8956C]"
                    : "text-white/90 hover:text-[#C8956C]"
                }`}
              >
                {link.label}
              </a>
            ))}
            <LanguageSwitcher variant={scrolled ? "dark" : "light"} />
            <Button
              asChild
              size="sm"
              className="rounded-lg bg-[#C8956C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#B07D56]"
            >
              <a href="#rooms">{t("hero.book")}</a>
            </Button>
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageSwitcher variant={scrolled ? "dark" : "light"} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`rounded-lg p-2 transition-colors ${
                scrolled
                  ? "text-[#1B3A4B] hover:bg-[#F5F0EB]"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-[#E8E0D8] bg-white px-6 py-6 shadow-lg md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className="text-base font-medium text-[#1B3A4B] transition-colors hover:text-[#C8956C]"
                >
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                className="mt-2 w-full rounded-lg bg-[#C8956C] py-3 text-base font-semibold text-white hover:bg-[#B07D56]"
              >
                <a href="#rooms" onClick={closeMobile}>
                  {t("hero.book")}
                </a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;