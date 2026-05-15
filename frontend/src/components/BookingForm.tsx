import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Users, Euro, Loader2, CheckCircle2, Baby } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { roomPricingMap, calculateTotalPrice, getSeason, CHILD_PRICE_PER_NIGHT } from "@/data/pricing";
import { roomTranslations } from "@/i18n/translations";

interface BookingFormProps {
  roomId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  onBookingSuccess: () => void;
}

function formatDate(date: Date, lang: string): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  if (lang === "hu") return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}.`;
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

const BookingForm = ({ roomId, checkIn, checkOut, onBookingSuccess }: BookingFormProps) => {
  const { language, t } = useLanguage();
  const pricing = roomPricingMap[roomId];

  const [guestCount, setGuestCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const priceInfo = useMemo(() => {
    if (!checkIn || !checkOut || !pricing) return null;
    return calculateTotalPrice(checkIn, checkOut, pricing, guestCount, childCount);
  }, [checkIn, checkOut, pricing, guestCount, childCount]);

  const getRoomLabel = (): string => {
    const rt = roomTranslations[language]?.[roomId];
    return rt?.title ?? roomId;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !pricing || !priceInfo) return;

    setSubmitting(true);

    const recipient = "fridrichapartman@gmail.com";
    const roomLabel = getRoomLabel();

    const subject = encodeURIComponent(
      `${t("booking.emailSubject")} – ${guestName} – ${roomLabel}`
    );

    const breakdownText = priceInfo.breakdown
      .map((item) => {
        const d = new Date(item.date);
        return `  ${formatDate(d, language)}: €${item.price.toFixed(2)} (€${item.pricePerPerson}/os)`;
      })
      .join("\n");

    const body = encodeURIComponent(
      `${t("booking.emailBody")}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `${t("booking.name")}: ${guestName}\n` +
      `E-mail: ${guestEmail}\n` +
      `${t("booking.phone")}: ${guestPhone || "—"}\n` +
      `${t("booking.roomLabel")}: ${roomLabel}\n` +
      `${t("booking.checkInLabel")}: ${formatDate(checkIn, language)}\n` +
      `${t("booking.checkOutLabel")}: ${formatDate(checkOut, language)}\n` +
      `${t("booking.guestCount")}: ${guestCount} ${t("booking.adults")}` +
      (childCount > 0 ? ` + ${childCount} ${t("booking.children")}` : "") + `\n` +
      `${t("booking.nights")}: ${priceInfo.nights}\n\n` +
      `${t("booking.priceBreakdown")}:\n${breakdownText}\n\n` +
      `${t("booking.total")}: €${priceInfo.total.toFixed(2)}\n\n` +
      `${t("booking.notes")}:\n${notes || "—"}\n`
    );

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      onBookingSuccess();
    }, 1000);
  };

  if (!pricing) return null;

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-500" />
        <h3 className="font-playfair mb-2 text-xl font-bold text-[#1B3A4B]">
          {t("booking.successTitle")}
        </h3>
        <p className="text-[#8A9BA8]">{t("booking.successDesc")}</p>
        <Button
          onClick={() => setSuccess(false)}
          variant="outline"
          className="mt-4 border-[#C8956C] text-[#C8956C] hover:bg-[#C8956C]/10"
        >
          {t("booking.newBooking")}
        </Button>
      </div>
    );
  }

  const maxGuests = pricing.maxGuests;

  return (
    <div className="rounded-xl border border-[#E8E0D8] bg-white p-4 md:p-6">
      <h3 className="font-playfair mb-4 text-xl font-bold text-[#1B3A4B]">
        {t("booking.formTitle")}
      </h3>

      {/* Date summary */}
      {checkIn && checkOut && priceInfo ? (
        <div className="mb-5 rounded-lg bg-[#F5F0EB] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-[#1B3A4B]">
            <CalendarDays className="h-4 w-4 text-[#C8956C]" />
            <span className="font-medium">
              {formatDate(checkIn, language)} → {formatDate(checkOut, language)}
            </span>
            <span className="text-[#8A9BA8]">
              ({priceInfo.nights} {t("booking.nights")})
            </span>
          </div>

          {/* Price breakdown */}
          <div className="space-y-1 text-sm">
            {priceInfo.breakdown.map((item) => {
              const d = new Date(item.date);
              const season = getSeason(d);
              const dayOfWeek = d.getDay();
              const isWknd = dayOfWeek === 5 || dayOfWeek === 6;
              return (
                <div key={item.date} className="flex items-center justify-between text-[#8A9BA8]">
                  <span>
                    {formatDate(d, language)}
                    {season === "holiday" && (
                      <span className="ml-1 text-xs text-orange-500">({t("booking.highSeason")})</span>
                    )}
                    {season === "summer" && (
                      <span className="ml-1 text-xs text-yellow-600">({t("booking.midSeason")})</span>
                    )}
                    {isWknd && (
                      <span className="ml-1 text-xs text-blue-500">({t("booking.weekend")})</span>
                    )}
                  </span>
                  <span className="font-medium text-[#1B3A4B]">€{item.price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          {/* Child pricing note */}
          {childCount > 0 && (
            <p className="mt-2 text-xs text-[#8A9BA8] italic">
              {t("booking.childPriceNote")} (€{CHILD_PRICE_PER_NIGHT}/{t("booking.childPerNight")})
            </p>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-[#E8E0D8] pt-3">
            <div className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-[#C8956C]" />
              <span className="text-lg font-bold text-[#1B3A4B]">{t("booking.total")}</span>
            </div>
            <span className="text-2xl font-bold text-[#C8956C]">€{priceInfo.total.toFixed(2)}</span>
          </div>
          <p className="mt-2 text-[11px] italic text-[#8A9BA8]">
            {t("booking.localTaxNote")}
          </p>
        </div>
      ) : (
        <div className="mb-5 rounded-lg border-2 border-dashed border-[#E8E0D8] p-4 text-center text-sm text-[#8A9BA8]">
          <CalendarDays className="mx-auto mb-2 h-8 w-8 text-[#C8956C]/40" />
          {t("booking.selectDatesPrompt")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Adult guest count */}
        <div>
          <Label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#1B3A4B]">
            <Users className="h-4 w-4 text-[#C8956C]" />
            {t("booking.adults")}
          </Label>
          <Select value={String(guestCount)} onValueChange={(v) => setGuestCount(Number(v))}>
            <SelectTrigger className="border-[#E8E0D8]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? t("booking.adult") : t("booking.adults")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Child count (3-12 years) */}
        <div>
          <Label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#1B3A4B]">
            <Baby className="h-4 w-4 text-[#C8956C]" />
            {t("booking.children")} <span className="text-xs text-[#8A9BA8] font-normal">(3–12 {t("booking.years")})</span>
          </Label>
          <Select value={String(childCount)} onValueChange={(v) => setChildCount(Number(v))}>
            <SelectTrigger className="border-[#E8E0D8]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxGuests + 1 }, (_, i) => i).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 0 ? `(${t("booking.noChildren")})` : n === 1 ? t("booking.child") : t("booking.children")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1 text-xs text-[#8A9BA8]">
            €{CHILD_PRICE_PER_NIGHT}/{t("booking.childPerNight")}
          </p>
        </div>

        {/* Name */}
        <div>
          <Label className="mb-1.5 text-sm font-medium text-[#1B3A4B]">{t("booking.name")} *</Label>
          <Input
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder={t("booking.namePlaceholder")}
            className="border-[#E8E0D8]"
          />
        </div>

        {/* Email */}
        <div>
          <Label className="mb-1.5 text-sm font-medium text-[#1B3A4B]">{t("booking.email")} *</Label>
          <Input
            required
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder={t("booking.emailPlaceholder")}
            className="border-[#E8E0D8]"
          />
        </div>

        {/* Phone */}
        <div>
          <Label className="mb-1.5 text-sm font-medium text-[#1B3A4B]">{t("booking.phone")}</Label>
          <Input
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder={t("booking.phonePlaceholder")}
            className="border-[#E8E0D8]"
          />
        </div>

        {/* Notes */}
        <div>
          <Label className="mb-1.5 text-sm font-medium text-[#1B3A4B]">{t("booking.notes")}</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("booking.notesPlaceholder")}
            className="min-h-[80px] border-[#E8E0D8]"
          />
        </div>

        <Button
          type="submit"
          disabled={!checkIn || !checkOut || !guestName || !guestEmail || submitting}
          className="w-full bg-[#C8956C] py-3 text-base font-semibold hover:bg-[#B07D56] disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("booking.submitting")}
            </>
          ) : (
            t("booking.submitBooking")
          )}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;