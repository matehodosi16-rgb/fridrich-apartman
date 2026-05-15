import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const galleryImages = [
  { src: "/assets/apartment/gallery/IMG_1198.jpeg", alt: "Záhrada a terasa" },
  { src: "/assets/apartment/gallery/IMG_1200.jpeg", alt: "Vonkajšie priestory" },
  { src: "/assets/apartment/gallery/IMG_1201.jpeg", alt: "Záhrada s ihriskom" },
  { src: "/assets/apartment/gallery/IMG_1202.jpeg", alt: "Záhradné stromy" },
  { src: "/assets/apartment/gallery/IMG_1206.jpeg", alt: "Budova a zeleň" },
  { src: "/assets/apartment/gallery/IMG_1207.jpeg", alt: "Vonkajšie priestory" },
];

const GallerySection = () => {
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + galleryImages.length) % galleryImages.length
      );
    }
  };

  return (
    <>
      <section id="gallery" className="bg-white px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-14 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C8956C]">
              {t("gallery.label")}
            </p>
            <h2 className="font-script mb-4 text-4xl font-bold text-[#1B3A4B] md:text-5xl">
              {t("gallery.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#8A9BA8]">
              {t("gallery.subtitle")}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, index) => (
              <button
                key={img.src}
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#C8956C] focus:ring-offset-2"
                style={{ imageOrientation: "from-image" }}
              >
                <div className="aspect-[4/3] w-full">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ imageOrientation: "from-image" }}
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#1B3A4B]/0 transition-all duration-300 group-hover:bg-[#1B3A4B]/30">
                  <div className="scale-0 rounded-full bg-white/90 p-3 transition-transform duration-300 group-hover:scale-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#1B3A4B]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Image */}
          <div
            className="max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              style={{ imageOrientation: "from-image" }}
            />
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default GallerySection;