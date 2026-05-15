import { useState, useEffect } from "react";
import { createClient } from "@metagptx/web-sdk";
import BookingCalendar from "./BookingCalendar";
import BookingForm from "./BookingForm";
import { useLanguage } from "@/i18n/LanguageContext";

const client = createClient();

interface Reservation {
  id: number;
  room_id: string;
  check_in: string;
  check_out: string;
  status: string;
}

interface BookingWidgetProps {
  roomId: string;
}

/** Generate a Set of "YYYY-MM-DD" strings for every date between check_in (inclusive) and check_out (exclusive). */
function getBookedDateStrings(reservations: Reservation[], roomId: string): Set<string> {
  const dates = new Set<string>();
  for (const r of reservations) {
    if (r.room_id !== roomId) continue;
    if (r.status === "cancelled") continue;
    const start = new Date(r.check_in + "T00:00:00");
    const end = new Date(r.check_out + "T00:00:00");
    const current = new Date(start);
    while (current < end) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, "0");
      const d = String(current.getDate()).padStart(2, "0");
      dates.add(`${y}-${m}-${d}`);
      current.setDate(current.getDate() + 1);
    }
  }
  return dates;
}

const BookingWidget = ({ roomId }: BookingWidgetProps) => {
  const { t } = useLanguage();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await client.entities.reservations.query({
          query: { room_id: roomId },
          limit: 200,
        });
        if (!cancelled && response?.data?.items) {
          const dates = getBookedDateStrings(response.data.items as Reservation[], roomId);
          setBookedDates(dates);
        }
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchReservations();
    return () => { cancelled = true; };
  }, [roomId]);

  const handleSelectCheckIn = (date: Date) => {
    setCheckIn(date);
    setCheckOut(null);
  };

  const handleSelectCheckOut = (date: Date) => {
    setCheckOut(date);
  };

  const handleClear = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  const handleBookingSuccess = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-2xl font-bold text-[#1B3A4B]">
        {t("booking.title")}
      </h2>

      {loading && (
        <p className="text-sm text-[#8A9BA8] animate-pulse">{t("booking.loadingAvailability")}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <BookingCalendar
          checkIn={checkIn}
          checkOut={checkOut}
          onSelectCheckIn={handleSelectCheckIn}
          onSelectCheckOut={handleSelectCheckOut}
          onClear={handleClear}
          bookedDates={bookedDates}
        />
        <BookingForm
          roomId={roomId}
          checkIn={checkIn}
          checkOut={checkOut}
          onBookingSuccess={handleBookingSuccess}
        />
      </div>
    </div>
  );
};

export default BookingWidget;