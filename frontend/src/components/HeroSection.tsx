import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/apartment/common/IMG_1211.jpeg"
          alt="Fridrich Apartman exteriér"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#C8956C]">
          {t("hero.welcome")}
        </p>
        <h1 className="font-script mb-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
          {t("hero.title")}
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-white/80 md:text-xl">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            asChild
            className="rounded-lg bg-[#C8956C] px-8 py-6 text-base font-semibold text-white transition hover:bg-[#B07D56]"
          >
            <a href="#rooms">{t("hero.book")}</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-lg border-white/40 bg-transparent px-8 py-6 text-base font-semibold text-white transition hover:bg-white/10 hover:text-white"
          >
            <a href="#rooms">{t("hero.explore")}</a>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;