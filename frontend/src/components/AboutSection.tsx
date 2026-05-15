import { useLanguage } from "@/i18n/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  const highlights = [
    { icon: "📍", titleKey: "about.h1.title", descKey: "about.h1.desc" },
    { icon: "🛋️", titleKey: "about.h2.title", descKey: "about.h2.desc" },
    { icon: "🔑", titleKey: "about.h3.title", descKey: "about.h3.desc" },
    { icon: "⭐", titleKey: "about.h4.title", descKey: "about.h4.desc" },
  ];

  return (
    <section id="about" className="bg-[#F5F0EB] px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/assets/apartment/common/IMG_1592_2.jpeg"
              alt="Útulná obývačka"
              className="h-[400px] w-full object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {/* Content */}
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C8956C]">
              {t("about.label")}
            </p>
            <h2 className="font-script mb-6 text-4xl font-bold text-[#1B3A4B] md:text-5xl">
              {t("about.title")}
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-[#2C2C2C]/70">
              {t("about.p1")}
            </p>
            <p className="mb-8 text-lg leading-relaxed text-[#2C2C2C]/70">
              {t("about.p2")}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div
                  key={item.titleKey}
                  className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <span className="mb-2 block text-2xl">{item.icon}</span>
                  <h3 className="mb-1 font-semibold text-[#1B3A4B]">{t(item.titleKey)}</h3>
                  <p className="text-sm text-[#8A9BA8]">{t(item.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;