import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1B3A4B] px-6 py-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-script mb-4 text-2xl font-bold text-white">
              Fridrich Apartman
            </h3>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/50">
              {t("footer.desc")}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#C8956C]"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#C8956C]"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#C8956C]"
                aria-label="Airbnb"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 16.966c-.457 1.069-1.396 1.778-2.502 1.778-.756 0-1.396-.29-2.036-.87-.64-.58-1.28-1.45-2.036-2.61-.93 1.16-1.686 2.03-2.326 2.61-.64.58-1.28.87-2.036.87-1.106 0-2.045-.71-2.502-1.778-.466-1.088-.35-2.466.35-4.134.698-1.668 2.036-3.736 4.072-6.346.35-.464.698-.87 1.048-1.218.35-.348.698-.58 1.048-.696.35-.116.698-.116 1.048 0 .35.116.698.348 1.048.696.35.348.698.754 1.048 1.218 2.036 2.61 3.374 4.678 4.072 6.346.7 1.668.816 3.046.35 4.134z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-sm text-white/50 transition hover:text-[#C8956C]">
                  {t("nav.about")}
                </a>
              </li>
              <li>
                <a href="#rooms" className="text-sm text-white/50 transition hover:text-[#C8956C]">
                  {t("footer.ourRooms")}
                </a>
              </li>
              <li>
                <a href="#amenities" className="text-sm text-white/50 transition hover:text-[#C8956C]">
                  {t("nav.amenities")}
                </a>
              </li>
              <li>
                <a href="#location" className="text-sm text-white/50 transition hover:text-[#C8956C]">
                  {t("nav.location")}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-white/50 transition hover:text-[#C8956C]">
                  {t("footer.contactReservation")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold text-white">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>📍 Čičovská 53, Veľký Meder</li>
              <li>📧 fridrichapartman@gmail.com</li>
              <li>📞 +421 905 647 155</li>
              <li>🕐 Check-in: 15:00 – 22:00</li>
              <li>🕐 Check-out: do 11:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Fridrich Apartman. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;