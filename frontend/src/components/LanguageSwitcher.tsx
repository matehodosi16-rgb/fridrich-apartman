import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { languageNames, languageFlags, type Language } from "@/i18n/translations";
import { Globe } from "lucide-react";

const languages: Language[] = ["hu", "sk", "cz", "pl"];

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

const LanguageSwitcher = ({ variant = "light" }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonClasses =
    variant === "dark"
      ? "flex items-center gap-1.5 rounded-full bg-[#1B3A4B]/10 px-3 py-1.5 text-sm font-medium text-[#1B3A4B] transition hover:bg-[#1B3A4B]/20"
      : "flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={buttonClasses}
        aria-label="Language selector"
      >
        <Globe className="h-4 w-4" />
        <span>{languageFlags[language]}</span>
        <span className="hidden sm:inline">{languageNames[language]}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-white/20 bg-[#1B3A4B]/95 shadow-xl backdrop-blur-md">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-white/10 ${
                language === lang
                  ? "bg-[#C8956C]/20 font-semibold text-[#C8956C]"
                  : "text-white/80"
              }`}
            >
              <span className="text-base">{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;