import { useState } from "react";
import BookingCalendar from "./BookingCalendar";
import BookingForm from "./BookingForm";
import { useLanguage } from "@/i18n/LanguageContext";

interface BookingWidgetProps {
  roomId: string;
}

const BookingWidget = ({ roomId }: BookingWidgetProps) => {
  const { t } = useLanguage();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [bookedDates] = useState<Set<string>>(new Set());

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