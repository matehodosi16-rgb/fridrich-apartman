import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, ArrowRight, BedDouble } from "lucide-react";
import rooms from "@/data/rooms";
import { useLanguage } from "@/i18n/LanguageContext";
import { roomTranslations, tagTranslations, capacityTranslations } from "@/i18n/translations";

const RoomsGallery = () => {
  const { language, t } = useLanguage();

  return (
    <section id="rooms" className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C8956C]">
            {t("rooms.label")}
          </p>
          <h2 className="font-script mb-4 text-4xl font-bold text-[#1B3A4B] md:text-5xl">
            {t("rooms.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#8A9BA8]">
            {t("rooms.subtitle")}
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const rt = roomTranslations[language]?.[room.id];
            const title = rt?.title ?? room.title;
            const description = rt?.description ?? room.description;
            const beds = rt?.beds ?? room.beds;
            const capacity = room.capacity
              ? capacityTranslations[language]?.[room.capacity] ?? room.capacity
              : undefined;

            return (
              <Link key={room.id} to={`/izba/${room.id}`} className="group">
                <Card className="h-full overflow-hidden border-0 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  {/* Room image or color header */}
                  {room.images && room.images.length > 0 ? (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={room.images[0].src}
                        alt={room.images[0].alt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
                        <span className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                          {t("rooms.viewDetails")}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-32 items-center justify-center bg-gradient-to-br from-[#1B3A4B] to-[#2D5F73]">
                      <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                        {t("rooms.viewDetails")}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  )}

                  <CardContent className="p-5">
                    <h3 className="font-playfair mb-1.5 text-xl font-bold text-[#1B3A4B]">
                      {title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-[#8A9BA8]">
                      {description}
                    </p>

                    {/* Room Info */}
                    <div className="mb-3 flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        {capacity && (
                          <div className="flex items-center gap-1.5 text-[#1B3A4B]">
                            <Users className="h-3.5 w-3.5 text-[#C8956C]" />
                            <span className="text-xs font-medium">
                              {capacity}
                            </span>
                          </div>
                        )}
                      </div>
                      {beds && (
                        <div className="flex items-center gap-1.5 text-[#1B3A4B]">
                          <BedDouble className="h-3.5 w-3.5 text-[#C8956C]" />
                          <span className="text-xs font-medium">
                            {beds}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {room.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-[#F5F0EB] text-xs text-[#1B3A4B]"
                        >
                          {tagTranslations[language]?.[tag] ?? tag}
                        </Badge>
                      ))}
                      {room.tags.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-[#F5F0EB] text-xs text-[#8A9BA8]"
                        >
                          +{room.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoomsGallery;