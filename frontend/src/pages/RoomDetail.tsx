import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, ImageIcon, BedDouble, ChevronLeft, ChevronRight, X } from "lucide-react";
import rooms from "@/data/rooms";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import { useLanguage } from "@/i18n/LanguageContext";
import { roomTranslations, tagTranslations, capacityTranslations } from "@/i18n/translations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const RoomDetail = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const room = rooms.find((r) => r.id === roomId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { language, t } = useLanguage();

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F6F2]">
        <h1 className="font-script mb-4 text-4xl font-bold text-[#1B3A4B]">
          {t("roomDetail.notFound")}
        </h1>
        <p className="mb-8 text-[#8A9BA8]">{t("roomDetail.notFoundDesc")}</p>
        <Button asChild className="bg-[#C8956C] hover:bg-[#B07D56]">
          <Link to="/#rooms">{t("roomDetail.backToRooms")}</Link>
        </Button>
      </div>
    );
  }

  const rt = roomTranslations[language]?.[room.id];
  const title = rt?.title ?? room.title;
  const description = rt?.description ?? room.description;
  const beds = rt?.beds ?? room.beds;
  const capacity = room.capacity
    ? capacityTranslations[language]?.[room.capacity] ?? room.capacity
    : undefined;

  const hasImages = room.images && room.images.length > 0;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goNext = () => {
    if (room.images) {
      setLightboxIndex((prev) => (prev + 1) % room.images!.length);
    }
  };

  const goPrev = () => {
    if (room.images) {
      setLightboxIndex((prev) => (prev - 1 + room.images!.length) % room.images!.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      <nav className="sticky top-0 z-50 border-b border-[#E8E0D8] bg-white/95 px-6 py-4 backdrop-blur-md md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/#rooms"
            className="flex items-center gap-2 text-[#1B3A4B] transition hover:text-[#C8956C]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">{t("roomDetail.backToRooms")}</span>
          </Link>
          <Link to="/" className="font-script text-xl font-bold text-[#1B3A4B]">
            Fridrich Apartman
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="dark" />
            <Button asChild size="sm" className="bg-[#C8956C] hover:bg-[#B07D56]">
              <a href="/#contact">{t("hero.book")}</a>
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 lg:px-20">
        <div className="mb-8">
          <h1 className="font-script mb-3 text-4xl font-bold text-[#1B3A4B] md:text-5xl">
            {title}
          </h1>
          <p className="mb-5 max-w-3xl text-lg text-[#8A9BA8]">{description}</p>
          <div className="flex flex-wrap items-center gap-4">
            {capacity && (
              <div className="flex items-center gap-2 text-[#1B3A4B]">
                <Users className="h-4 w-4 text-[#C8956C]" />
                <span className="text-sm font-medium">{capacity}</span>
              </div>
            )}
            {beds && (
              <div className="flex items-center gap-2 text-[#1B3A4B]">
                <BedDouble className="h-4 w-4 text-[#C8956C]" />
                <span className="text-sm font-medium">{beds}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {room.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#F5F0EB] px-4 py-1.5 text-sm text-[#1B3A4B] hover:bg-[#C8956C] hover:text-white"
            >
              {tagTranslations[language]?.[tag] ?? tag}
            </Badge>
          ))}
        </div>

        {hasImages ? (
          <div className="mb-10">
            <div
              className="mb-3 cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => openLightbox(0)}
            >
              <img
                src={room.images![0].src}
                alt={room.images![0].alt}
                className="h-[400px] w-full object-cover transition-transform duration-300 hover:scale-105 md:h-[500px]"
              />
            </div>
            {room.images!.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {room.images!.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer overflow-hidden rounded-xl"
                    onClick={() => openLightbox(idx + 1)}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="h-32 w-full object-cover transition-transform duration-300 hover:scale-105 md:h-40"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-10 rounded-2xl border-2 border-dashed border-[#C8956C]/30 bg-[#C8956C]/5 p-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-16 w-16 text-[#C8956C]/40" />
            <h3 className="font-script mb-2 text-xl font-bold text-[#1B3A4B]">
              {t("roomDetail.photosComingSoon")}
            </h3>
            <p className="mx-auto max-w-md text-[#8A9BA8]">
              {t("roomDetail.photosComingSoonDesc")}
            </p>
          </div>
        )}

        {/* Booking Calendar & Form */}
        <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
          <BookingWidget roomId={room.id} />
        </div>

        {/* Contact section */}
        <div className="mt-6 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="font-script mb-4 text-2xl font-bold text-[#1B3A4B]">
            {t("roomDetail.interested")}
          </h2>
          <p className="mb-6 text-[#8A9BA8]">{t("roomDetail.interestedDesc")}</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-[#C8956C] hover:bg-[#B07D56]">
              <a href="/#contact">{t("roomDetail.contactUs")}</a>
            </Button>
            <Button asChild variant="outline" className="border-[#1B3A4B]/20 text-[#1B3A4B] hover:bg-[#F5F0EB]">
              <Link to="/#rooms">{t("roomDetail.viewAllRooms")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {lightboxOpen && room.images && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-4 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={room.images[lightboxIndex].src}
            alt={room.images[lightboxIndex].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 text-center text-sm text-white/70">
            {room.images[lightboxIndex].alt} — {lightboxIndex + 1} / {room.images.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RoomDetail;