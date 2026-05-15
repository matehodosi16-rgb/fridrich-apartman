import {
  Wifi, Car, UtensilsCrossed, Snowflake, Tv, ShieldCheck, Coffee,
  Bed, Sofa, Fan, Dog, TreePine,
  Clock, Baby, Languages, Waves, Droplets,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";

interface AmenityCategory {
  categoryKey: string;
  icon: LucideIcon;
  items: string[];
}

const amenityCategories: AmenityCategory[] = [
  {
    categoryKey: "amenities.cat.parking",
    icon: Car,
    items: [
      "amenities.item.freeParking",
    ],
  },
  {
    categoryKey: "amenities.cat.internet",
    icon: Wifi,
    items: [
      "amenities.item.freeWifi",
    ],
  },
  {
    categoryKey: "amenities.cat.kitchen",
    icon: UtensilsCrossed,
    items: [
      "amenities.item.diningTable",
      "amenities.item.cooktop",
      "amenities.item.kitchenware",
      "amenities.item.kettle",
      "amenities.item.kitchen",
      "amenities.item.microwave",
      "amenities.item.fridge",
      "amenities.item.kitchenette",
    ],
  },
  {
    categoryKey: "amenities.cat.bedroom",
    icon: Bed,
    items: [
      "amenities.item.bedLinen",
      "amenities.item.wardrobe",
      "amenities.item.longBeds",
    ],
  },
  {
    categoryKey: "amenities.cat.bathroom",
    icon: Droplets,
    items: [
      "amenities.item.toiletPaper",
      "amenities.item.towels",
      "amenities.item.toilet",
      "amenities.item.shower",
    ],
  },
  {
    categoryKey: "amenities.cat.livingRoom",
    icon: Sofa,
    items: [
      "amenities.item.sofa",
    ],
  },
  {
    categoryKey: "amenities.cat.media",
    icon: Tv,
    items: [
      "amenities.item.flatScreenTv",
      "amenities.item.cableTv",
      "amenities.item.tv",
    ],
  },
  {
    categoryKey: "amenities.cat.roomEquipment",
    icon: Fan,
    items: [
      "amenities.item.dryingRack",
      "amenities.item.mosquitoNet",
      "amenities.item.woodenFloor",
      "amenities.item.fan",
    ],
  },
  {
    categoryKey: "amenities.cat.pets",
    icon: Dog,
    items: [
      "amenities.item.petsAllowed",
    ],
  },
  {
    categoryKey: "amenities.cat.outdoor",
    icon: TreePine,
    items: [
      "amenities.item.fireplace",
      "amenities.item.picnicArea",
      "amenities.item.gardenFurniture",
      "amenities.item.sunTerrace",
      "amenities.item.bbq",
      "amenities.item.terrace",
      "amenities.item.garden",
    ],
  },
  {
    categoryKey: "amenities.cat.thermalBath",
    icon: Waves,
    items: [
      "amenities.item.thermalBathNearby",
    ],
  },
  {
    categoryKey: "amenities.cat.dining",
    icon: Coffee,
    items: [
      "amenities.item.foodDelivery",
      "amenities.item.teaCoffeeMaker",
    ],
  },
  {
    categoryKey: "amenities.cat.recreation",
    icon: Waves,
    items: [
      "amenities.item.waterpark",
    ],
  },
  {
    categoryKey: "amenities.cat.services",
    icon: Clock,
    items: [
      "amenities.item.invoice",
      "amenities.item.flexibleCheckInOut",
    ],
  },
  {
    categoryKey: "amenities.cat.family",
    icon: Baby,
    items: [
      "amenities.item.playground",
    ],
  },
  {
    categoryKey: "amenities.cat.general",
    icon: Snowflake,
    items: [
      "amenities.item.airConditioning",
      "amenities.item.nonSmoking",
      "amenities.item.heating",
      "amenities.item.familyRooms",
    ],
  },
  {
    categoryKey: "amenities.cat.safety",
    icon: ShieldCheck,
    items: [
      "amenities.item.fireExtinguisher",
      "amenities.item.cctv",
      "amenities.item.keyAccess",
    ],
  },
  {
    categoryKey: "amenities.cat.languages",
    icon: Languages,
    items: [
      "amenities.item.langCzech",
      "amenities.item.langHungarian",
      "amenities.item.langPolish",
      "amenities.item.langSlovak",
    ],
  },
];

// Top highlights for the hero grid
const topHighlights = [
  { icon: Waves, titleKey: "amenities.highlight.thermalBath" },
  { icon: Car, titleKey: "amenities.highlight.parking" },
  { icon: Wifi, titleKey: "amenities.highlight.wifi" },
  { icon: Baby, titleKey: "amenities.highlight.family" },
  { icon: Snowflake, titleKey: "amenities.highlight.ac" },
  { icon: Dog, titleKey: "amenities.highlight.pets" },
];

const AmenitiesSection = () => {
  const { t } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (key: string) => {
    setExpandedCategory(expandedCategory === key ? null : key);
  };

  return (
    <section id="amenities" className="bg-[#1B3A4B] px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C8956C]">
            {t("amenities.label")}
          </p>
          <h2 className="font-script mb-4 text-4xl font-bold text-white md:text-5xl">
            {t("amenities.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {t("amenities.subtitle")}
          </p>
        </div>

        {/* Top Highlights */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {topHighlights.map((h) => {
            const IconComp = h.icon;
            return (
              <div
                key={h.titleKey}
                className="flex flex-col items-center rounded-xl border border-[#C8956C]/30 bg-[#C8956C]/10 p-4 text-center"
              >
                <IconComp className="mb-2 h-8 w-8 text-[#C8956C]" />
                <span className="text-sm font-medium text-white">{t(h.titleKey)}</span>
              </div>
            );
          })}
        </div>

        {/* Detailed Categories */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {amenityCategories.map((cat) => {
            const IconComp = cat.icon;
            const isExpanded = expandedCategory === cat.categoryKey;
            return (
              <div
                key={cat.categoryKey}
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-[#C8956C]/30"
              >
                <button
                  onClick={() => toggleCategory(cat.categoryKey)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C8956C]/20">
                    <IconComp className="h-5 w-5 text-[#C8956C]" />
                  </div>
                  <span className="flex-1 font-semibold text-white">{t(cat.categoryKey)}</span>
                  <svg
                    className={`h-5 w-5 text-white/50 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="border-t border-white/10 px-4 pb-4 pt-2">
                    <ul className="space-y-1.5">
                      {cat.items.map((itemKey) => (
                        <li key={itemKey} className="flex items-center gap-2 text-sm text-white/70">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8956C]" />
                          {t(itemKey)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;