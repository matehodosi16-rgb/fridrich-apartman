import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { getPricePerPerson, getSeason, type Season } from "@/data/pricing";

interface BookingCalendarProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelectCheckIn: (date: Date) => void;
  onSelectCheckOut: (date: Date) => void;
  onClear: () => void;
  bookedDates?: Set<string>;
}

const MONTH_NAMES: Record<string, string[]> = {
  sk: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"],
  hu: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"],
  cz: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
  pl: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
};

const DAY_NAMES: Record<string, string[]> = {
  sk: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"],
  hu: ["Hé", "Ke", "Sze", "Cs", "Pé", "Szo", "Va"],
  cz: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
  pl: ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"],
};

const SEASON_COLORS: Record<Season, string> = {
  winter: "bg-blue-50 text-blue-800",
  spring: "bg-green-50 text-green-800",
  summer: "bg-yellow-50 text-yellow-800",
  autumn: "bg-orange-50 text-orange-800",
  holiday: "bg-red-50 text-red-800",
};

const SEASON_DOT_COLORS: Record<Season, string> = {
  winter: "bg-blue-400",
  spring: "bg-green-400",
  summer: "bg-yellow-500",
  autumn: "bg-orange-400",
  holiday: "bg-red-400",
};

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return date > start && date < end;
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  let startDay = firstDay.getDay() - 1; // Monday = 0
  if (startDay < 0) startDay = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return cells;
}

/** Get the dominant price for a given month (price that applies to most days) */
function getMonthPrice(year: number, month: number): { price: number; season: Season } {
  const mid = new Date(year, month, 15);
  return { price: getPricePerPerson(mid), season: getSeason(mid) };
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const BookingCalendar = ({
  checkIn,
  checkOut,
  onSelectCheckIn,
  onSelectCheckOut,
  onClear,
  bookedDates = new Set(),
}: BookingCalendarProps) => {
  const { language, t } = useLanguage();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = MONTH_NAMES[language] || MONTH_NAMES.sk;
  const dayNames = DAY_NAMES[language] || DAY_NAMES.sk;

  const days = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const monthPriceInfo = useMemo(() => getMonthPrice(viewYear, viewMonth), [viewYear, viewMonth]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isPastMonth = viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  const handleDayClick = (date: Date) => {
    if (date < today) return;
    // Don't allow selecting booked dates
    if (bookedDates.has(toDateKey(date))) return;

    if (!checkIn || (checkIn && checkOut)) {
      onSelectCheckIn(date);
    } else {
      if (date <= checkIn) {
        onSelectCheckIn(date);
      } else {
        // Check if any booked date falls within the selected range
        const hasBookedInRange = hasBookedDateInRange(checkIn, date);
        if (hasBookedInRange) {
          // If there's a booked date in the range, start a new selection
          onSelectCheckIn(date);
        } else {
          onSelectCheckOut(date);
        }
      }
    }
  };

  /** Check if any booked date falls between start and end (exclusive) */
  const hasBookedDateInRange = (start: Date, end: Date): boolean => {
    const current = new Date(start);
    current.setDate(current.getDate() + 1);
    while (current < end) {
      if (bookedDates.has(toDateKey(current))) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

  const getDayClasses = (date: Date): string => {
    const isPast = date < today;
    const isBooked = bookedDates.has(toDateKey(date));

    if (isPast) return "text-gray-300 cursor-not-allowed";
    if (isBooked) return "bg-red-100 text-red-400 cursor-not-allowed line-through";

    const isCheckIn = checkIn && isSameDay(date, checkIn);
    const isCheckOut = checkOut && isSameDay(date, checkOut);
    const inRange = isInRange(date, checkIn, checkOut);

    if (isCheckIn) return "bg-[#C8956C] text-white rounded-l-full font-bold";
    if (isCheckOut) return "bg-[#C8956C] text-white rounded-r-full font-bold";
    if (inRange) return "bg-[#C8956C]/15 text-[#1B3A4B]";

    return "text-[#1B3A4B] hover:bg-[#F5F0EB] cursor-pointer";
  };

  // Season label translations
  const seasonLabels: Record<string, Record<Season, string>> = {
    sk: { winter: "Zima", spring: "Jar", summer: "Leto", autumn: "Jeseň", holiday: "Sviatky" },
    hu: { winter: "Tél", spring: "Tavasz", summer: "Nyár", autumn: "Ősz", holiday: "Ünnepek" },
    cz: { winter: "Zima", spring: "Jaro", summer: "Léto", autumn: "Podzim", holiday: "Svátky" },
    pl: { winter: "Zima", spring: "Wiosna", summer: "Lato", autumn: "Jesień", holiday: "Święta" },
  };

  const perPersonLabel: Record<string, string> = {
    sk: "€/osoba/noc",
    hu: "€/fő/éj",
    cz: "€/osoba/noc",
    pl: "€/osoba/noc",
  };

  const currentSeasonLabels = seasonLabels[language] || seasonLabels.sk;
  const currentPerPersonLabel = perPersonLabel[language] || perPersonLabel.sk;

  return (
    <div className="rounded-xl border border-[#E8E0D8] bg-white p-4 md:p-6">
      {/* Month navigation + price badge */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevMonth}
          disabled={isPastMonth}
          className="h-9 w-9 text-[#1B3A4B] hover:bg-[#F5F0EB]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="text-center">
          <h3 className="text-lg font-bold text-[#1B3A4B]">
            {monthNames[viewMonth]} {viewYear}
          </h3>
          {/* Monthly price indicator */}
          <div className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${SEASON_COLORS[monthPriceInfo.season]}`}>
            <Euro className="h-3 w-3" />
            <span>{monthPriceInfo.price}</span>
            <span className="opacity-70">{currentPerPersonLabel}</span>
            <span className="opacity-50">·</span>
            <span className="opacity-70">{currentSeasonLabels[monthPriceInfo.season]}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="h-9 w-9 text-[#1B3A4B] hover:bg-[#F5F0EB]"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day names header */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-[#8A9BA8]">
        {dayNames.map((name) => (
          <div key={name} className="py-1">{name}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 text-center text-sm">
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="py-2" />;
          }

          const isPast = date < today;
          const isBooked = bookedDates.has(toDateKey(date));
          const daySeason = getSeason(date);
          const dayPrice = getPricePerPerson(date);

          const bookedTooltip: Record<string, string> = {
            sk: "Obsadené",
            hu: "Foglalt",
            cz: "Obsazené",
            pl: "Zajęte",
          };

          return (
            <div
              key={date.toISOString()}
              className={`relative py-1.5 transition-colors ${getDayClasses(date)}`}
              onClick={() => !isPast && !isBooked && handleDayClick(date)}
              title={isBooked ? (bookedTooltip[language] || bookedTooltip.sk) : (!isPast ? `€${dayPrice} ${currentPerPersonLabel}` : undefined)}
            >
              <span className="text-sm">{date.getDate()}</span>
              {/* Season dot indicator for available dates, X for booked */}
              {!isPast && !isBooked && (
                <div className={`mx-auto mt-0.5 h-1 w-1 rounded-full ${SEASON_DOT_COLORS[daySeason]}`} />
              )}
              {!isPast && isBooked && (
                <div className="mx-auto mt-0.5 h-1 w-3 rounded-full bg-red-400" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 border-t border-[#E8E0D8] pt-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8A9BA8]">
          {checkIn && (
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-[#C8956C]" />
              <span>{t("booking.selected")}</span>
            </div>
          )}
          {/* Booked legend */}
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-red-100 border border-red-300" />
            <span className="text-red-400">{t("booking.booked")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <span>€16 {currentSeasonLabels.winter}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span>€18 {currentSeasonLabels.spring}/{currentSeasonLabels.autumn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span>€20 {currentSeasonLabels.summer}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <span>€22 {currentSeasonLabels.holiday}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-purple-400" />
            <span>€12 {t("booking.children")} (3–12)</span>
          </div>
        </div>
      </div>

      {/* Local tax note */}
      <p className="mt-3 text-center text-[11px] italic text-[#8A9BA8]">
        {t("booking.localTaxNote")}
      </p>

      {/* Clear button */}
      {(checkIn || checkOut) && (
        <div className="mt-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-[#8A9BA8] hover:text-[#C8956C]"
          >
            <X className="mr-1 h-3 w-3" />
            {t("booking.clearDates")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;