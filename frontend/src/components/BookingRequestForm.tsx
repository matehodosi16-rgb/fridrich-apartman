import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, AlertCircle, Calendar, Download } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import rooms from "@/data/rooms";
import { roomTranslations } from "@/i18n/translations";

interface BookingRequestFormProps {
  preselectedRoomId?: string;
}

function buildGoogleCalendarUrl(
  roomName: string,
  checkIn: string,
  checkOut: string,
  guests: string,
  guestName: string
): string {
  const ci = checkIn.replace(/-/g, "");
  const co = checkOut.replace(/-/g, "");
  const title = `Fridrich Apartman – ${roomName}`;
  const details = `Guest: ${guestName}\nGuests: ${guests}\nContact: fridrichapartman@gmail.com`;
  const location = "Brusno 346, 976 62 Brusno, Slovakia";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${ci}/${co}`,
    details,
    location,
    sf: "true",
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function buildIcsDownloadUrl(
  roomName: string,
  checkIn: string,
  checkOut: string,
  guests: string,
  guestName: string,
  phone: string,
  message: string
): string {
  const params = new URLSearchParams({
    guest_name: guestName,
    room_name: roomName,
    check_in: checkIn,
    check_out: checkOut,
    guests,
    phone: phone || "",
    message: message || "",
  });

  return `/api/ical?${params.toString()}`;
}

const BookingRequestForm = ({ preselectedRoomId }: BookingRequestFormProps) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    room: preselectedRoomId || "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);
  const [submittedRoomLabel, setSubmittedRoomLabel] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getRoomLabel = (roomId: string): string => {
    const rt = roomTranslations[language]?.[roomId];
    const room = rooms.find((r) => r.id === roomId);
    return rt?.title ?? room?.title ?? roomId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const roomLabel = formData.room ? getRoomLabel(formData.room) : "—";

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          room_name: roomLabel,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          guests: formData.guests,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmittedData({ ...formData });
        setSubmittedRoomLabel(roomLabel);
        setSuccess(true);
      } else {
        setError(result.message || t("bookingRequest.errorGeneric") || "Failed to send booking request. Please try again.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      setError(message || t("bookingRequest.errorGeneric") || "Failed to send booking request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIcsDownload = async () => {
    if (!submittedData) return;

    const url = buildIcsDownloadUrl(
      submittedRoomLabel,
      submittedData.checkIn,
      submittedData.checkOut,
      submittedData.guests,
      submittedData.name,
      submittedData.phone,
      submittedData.message
    );

    try {
      const response = await fetch(url);
      const icsContent = await response.text();
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "fridrich-booking.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  if (success && submittedData) {
    const googleUrl = buildGoogleCalendarUrl(
      submittedRoomLabel,
      submittedData.checkIn,
      submittedData.checkOut,
      submittedData.guests,
      submittedData.name
    );

    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-500" />
        <h3 className="font-script mb-3 text-2xl font-bold text-[#1B3A4B]">
          {t("bookingRequest.successTitle")}
        </h3>
        <p className="text-[#8A9BA8]">{t("bookingRequest.successDesc")}</p>

        <div className="mt-6 rounded-lg border border-green-100 bg-white p-5">
          <p className="mb-4 text-sm font-medium text-[#1B3A4B]">
            {t("bookingRequest.calendarDesc")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#4285F4] bg-[#4285F4] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#3367D6]"
            >
              <Calendar className="h-4 w-4" />
              {t("bookingRequest.addToGoogle")}
            </a>
            <button
              onClick={handleIcsDownload}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C8956C] bg-white px-5 py-2.5 text-sm font-medium text-[#C8956C] transition hover:bg-[#C8956C]/10"
            >
              <Download className="h-4 w-4" />
              {t("bookingRequest.downloadIcs")}
            </button>
          </div>
        </div>

        <Button
          onClick={() => {
            setSuccess(false);
            setSubmittedData(null);
            setSubmittedRoomLabel("");
            setFormData({
              name: "",
              email: "",
              phone: "",
              room: preselectedRoomId || "",
              checkIn: "",
              checkOut: "",
              guests: "1",
              message: "",
            });
          }}
          variant="outline"
          className="mt-6 border-[#C8956C] text-[#C8956C] hover:bg-[#C8956C]/10"
        >
          {t("bookingRequest.newRequest")}
        </Button>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-xl border border-[#E8E0D8] bg-white p-6 md:p-8">
      <h2 className="font-script mb-6 text-2xl font-bold text-[#1B3A4B]">
        {t("bookingRequest.title")}
      </h2>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="br-name" className="text-sm font-medium text-[#1B3A4B]">
              {t("bookingRequest.name")} *
            </Label>
            <Input
              id="br-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("bookingRequest.namePlaceholder")}
              required
              className="border-[#E8E0D8] focus:border-[#C8956C] focus:ring-[#C8956C]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="br-email" className="text-sm font-medium text-[#1B3A4B]">
              E-mail *
            </Label>
            <Input
              id="br-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("bookingRequest.emailPlaceholder")}
              required
              className="border-[#E8E0D8] focus:border-[#C8956C] focus:ring-[#C8956C]"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="br-phone" className="text-sm font-medium text-[#1B3A4B]">
              {t("bookingRequest.phone")}
            </Label>
            <Input
              id="br-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t("bookingRequest.phonePlaceholder")}
              className="border-[#E8E0D8] focus:border-[#C8956C] focus:ring-[#C8956C]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#1B3A4B]">
              {t("bookingRequest.room")} *
            </Label>
            <Select
              value={formData.room}
              onValueChange={(v) => setFormData({ ...formData, room: v })}
              required
            >
              <SelectTrigger className="border-[#E8E0D8]">
                <SelectValue placeholder={t("bookingRequest.roomPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => {
                  const rt = roomTranslations[language]?.[room.id];
                  const title = rt?.title ?? room.title;
                  return (
                    <SelectItem key={room.id} value={room.id}>
                      {title}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="br-checkin" className="text-sm font-medium text-[#1B3A4B]">
              {t("bookingRequest.checkIn")} *
            </Label>
            <Input
              id="br-checkin"
              name="checkIn"
              type="date"
              value={formData.checkIn}
              onChange={handleChange}
              min={today}
              required
              className="border-[#E8E0D8] focus:border-[#C8956C] focus:ring-[#C8956C]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="br-checkout" className="text-sm font-medium text-[#1B3A4B]">
              {t("bookingRequest.checkOut")} *
            </Label>
            <Input
              id="br-checkout"
              name="checkOut"
              type="date"
              value={formData.checkOut}
              onChange={handleChange}
              min={formData.checkIn || today}
              required
              className="border-[#E8E0D8] focus:border-[#C8956C] focus:ring-[#C8956C]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-[#1B3A4B]">
            {t("bookingRequest.guests")} *
          </Label>
          <Select
            value={formData.guests}
            onValueChange={(v) => setFormData({ ...formData, guests: v })}
          >
            <SelectTrigger className="border-[#E8E0D8]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? t("bookingRequest.guestSingular") : t("bookingRequest.guestPlural")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="br-message" className="text-sm font-medium text-[#1B3A4B]">
            {t("bookingRequest.message")}
          </Label>
          <Textarea
            id="br-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("bookingRequest.messagePlaceholder")}
            rows={4}
            className="border-[#E8E0D8] focus:border-[#C8956C] focus:ring-[#C8956C]"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting || !formData.room}
          className="w-full rounded-lg bg-[#C8956C] py-6 text-base font-semibold text-white transition hover:bg-[#B07D56] disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("bookingRequest.submitting")}
            </>
          ) : (
            t("bookingRequest.submit")
          )}
        </Button>
      </form>
    </div>
  );
};

export default BookingRequestForm;