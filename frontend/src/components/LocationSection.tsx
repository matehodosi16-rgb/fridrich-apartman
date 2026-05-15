import { MapPin, Clock, Navigation, TrainFront, ShoppingBag, Waves } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix default marker icons for Leaflet in bundled environments
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom colored marker using SVG
const createColoredIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/>
    </svg>`,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
  });

const apartmentIcon = createColoredIcon("#C8956C");
const centerIcon = createColoredIcon("#1B3A4B");
const shopsIcon = createColoredIcon("#4CAF50");
const stationIcon = createColoredIcon("#FF5722");
const thermalIcon = createColoredIcon("#2196F3");

// Coordinates
const APARTMENT = { lat: 47.84638, lng: 17.76523 };
const PLACES = [
  { key: "center", lat: 47.85290, lng: 17.76830, icon: centerIcon },
  { key: "shops", lat: 47.85180, lng: 17.76700, icon: shopsIcon },
  { key: "station", lat: 47.86050, lng: 17.77200, icon: stationIcon },
  { key: "aquapark", lat: 47.84500, lng: 17.76250, icon: thermalIcon },
];

const LocationSection = () => {
  const { t } = useLanguage();

  const nearbyPlaces = [
    { nameKey: "location.center", distKey: "location.center.dist", icon: MapPin },
    { nameKey: "location.shops", distKey: "location.shops.dist", icon: ShoppingBag },
    { nameKey: "location.station", distKey: "location.station.dist", icon: TrainFront },
    { nameKey: "location.aquapark", distKey: "location.aquapark.dist", icon: Waves },
  ];

  const placeColors = ["#1B3A4B", "#4CAF50", "#FF5722", "#2196F3"];

  useEffect(() => {
    // Inject custom CSS for markers
    const style = document.createElement("style");
    style.textContent = `.custom-marker { background: none !important; border: none !important; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <section id="location" className="bg-[#F5F0EB] px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#C8956C]">
            {t("location.label")}
          </p>
          <h2 className="font-script mb-4 text-4xl font-bold text-[#1B3A4B] md:text-5xl">
            {t("location.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#8A9BA8]">
            {t("location.subtitle")}
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Interactive Map */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl shadow-xl" style={{ height: 420 }}>
              <MapContainer
                center={[APARTMENT.lat, APARTMENT.lng]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
                className="rounded-2xl"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Apartment marker */}
                <Marker position={[APARTMENT.lat, APARTMENT.lng]} icon={apartmentIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong className="text-[#1B3A4B]">Fridrich Apartman</strong>
                      <br />
                      <span className="text-sm text-gray-500">Čičovská 53, Veľký Meder</span>
                    </div>
                  </Popup>
                </Marker>
                {/* Nearby place markers */}
                {PLACES.map((place) => (
                  <Marker
                    key={place.key}
                    position={[place.lat, place.lng]}
                    icon={place.icon}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>{t(`location.${place.key}`)}</strong>
                        <br />
                        <span className="text-sm text-gray-500">
                          {t(`location.${place.key}.dist`)}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Address Card */}
            <div className="overflow-hidden rounded-2xl bg-[#1B3A4B] shadow-xl">
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MapPin className="mb-4 h-12 w-12 text-[#C8956C]" />
                <h3 className="font-playfair mb-2 text-2xl font-bold text-white">
                  Fridrich Apartman
                </h3>
                <p className="mb-2 text-white/60">
                  Čičovská 53, 932 01 Veľký Meder
                </p>
                <p className="mb-6 text-sm text-white/40">
                  {t("location.country")}
                </p>
                <a
                  href="https://www.google.com/maps?q=47.84638715308215,17.765233157964342"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#C8956C] px-6 py-3 font-semibold text-white transition hover:bg-[#B07D56]"
                >
                  <Navigation className="h-4 w-4" />
                  {t("location.openMaps")}
                </a>
              </div>
            </div>
          </div>

          {/* Nearby Places */}
          <div>
            <h3 className="font-playfair mb-6 text-2xl font-bold text-[#1B3A4B]">
              {t("location.nearby")}
            </h3>

            {/* Map Legend */}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-[#8A9BA8]">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: "#C8956C" }} />
                Fridrich Apartman
              </span>
              {nearbyPlaces.map((place, i) => (
                <span key={place.nameKey} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: placeColors[i] }}
                  />
                  {t(place.nameKey)}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              {nearbyPlaces.map((place, i) => {
                const IconComp = place.icon;
                return (
                  <div
                    key={place.nameKey}
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${placeColors[i]}15` }}
                      >
                        <IconComp className="h-5 w-5" style={{ color: placeColors[i] }} />
                      </div>
                      <span className="font-medium text-[#1B3A4B]">{t(place.nameKey)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#8A9BA8]">
                      <Clock className="h-4 w-4" />
                      {t(place.distKey)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Check-in Info */}
            <div className="mt-8 rounded-xl border border-[#C8956C]/20 bg-white p-6">
              <h4 className="mb-3 font-semibold text-[#1B3A4B]">{t("location.checkinInfo")}</h4>
              <div className="space-y-2 text-sm text-[#8A9BA8]">
                <p>🕐 {t("location.checkin")}</p>
                <p>🕐 {t("location.checkout")}</p>
                <p>🔑 {t("location.key")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;