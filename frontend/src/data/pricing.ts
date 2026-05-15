// Pricing configuration for Fridrich Apartman
// All prices are PER PERSON PER NIGHT (€)
//
// Seasons:
//   Jan 1 – Mar 31:   €16/person/night (winter)
//   Apr 1 – Jun 30:   €18/person/night (spring)
//   Jul 1 – Aug 31:   €20/person/night (summer)
//   Sep 1 – Dec 22:   €18/person/night (autumn)
//   Dec 23 – Dec 31:  €22/person/night (holiday/Christmas-New Year)
//
// Slovak public holidays: €22/person/night

export interface RoomPricing {
  roomId: string;
  maxGuests: number;
}

export const roomPricingMap: Record<string, RoomPricing> = {
  "izba-1": { roomId: "izba-1", maxGuests: 4 },
  "izba-2": { roomId: "izba-2", maxGuests: 6 },
  "izba-3": { roomId: "izba-3", maxGuests: 5 },
  "izba-4": { roomId: "izba-4", maxGuests: 5 },
  "izba-5": { roomId: "izba-5", maxGuests: 4 },
  "izba-6": { roomId: "izba-6", maxGuests: 4 },
  "izba-7": { roomId: "izba-7", maxGuests: 4 },
  "izba-8": { roomId: "izba-8", maxGuests: 4 },
  "izba-9": { roomId: "izba-9", maxGuests: 5 },
  "izba-10": { roomId: "izba-10", maxGuests: 4 },
  "izba-11": { roomId: "izba-11", maxGuests: 4 },
};

export type Season = "winter" | "spring" | "summer" | "autumn" | "holiday";

// Slovak public holidays (fixed dates)
// Returns true if the given date is a Slovak public holiday
function isSlovakHoliday(date: Date): boolean {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const year = date.getFullYear();

  const fixedHolidays = [
    [1, 1],   // Deň vzniku Slovenskej republiky (New Year's Day)
    [1, 6],   // Zjavenie Pána (Epiphany)
    [5, 1],   // Sviatok práce (Labour Day)
    [5, 8],   // Deň víťazstva nad fašizmom
    [7, 5],   // Sviatok sv. Cyrila a Metoda
    [8, 29],  // Výročie SNP
    [9, 1],   // Deň Ústavy SR
    [9, 15],  // Sedembolestná Panna Mária
    [11, 1],  // Sviatok všetkých svätých
    [11, 17], // Deň boja za slobodu a demokraciu
    [12, 24], // Štedrý deň (Christmas Eve)
    [12, 25], // Prvý sviatok vianočný (Christmas Day)
    [12, 26], // Druhý sviatok vianočný (St. Stephen's Day)
    [12, 31], // Silvester (New Year's Eve)
  ];

  // Check fixed holidays
  for (const [m, d] of fixedHolidays) {
    if (month === m && day === d) return true;
  }

  // Easter Friday and Easter Monday (variable dates)
  const easter = getEasterDate(year);
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);

  const dateStr = `${month}-${day}`;
  const goodFridayStr = `${goodFriday.getMonth() + 1}-${goodFriday.getDate()}`;
  const easterMondayStr = `${easterMonday.getMonth() + 1}-${easterMonday.getDate()}`;

  if (dateStr === goodFridayStr || dateStr === easterMondayStr) return true;

  return false;
}

// Calculate Easter Sunday date using the Anonymous Gregorian algorithm
function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function getSeason(date: Date): Season {
  // Check Christmas/New Year period first (Dec 23 – Dec 31)
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  if (month === 12 && day >= 23) return "holiday";

  // Then check individual Slovak public holidays
  if (isSlovakHoliday(date)) return "holiday";

  // Jan 1 – Mar 31 (inclusive): winter €16
  if (month >= 1 && month <= 3) return "winter";
  // Apr 1 – Jun 30 (inclusive): spring €18
  if (month >= 4 && month <= 6) return "spring";
  // Jul 1 – Aug 31 (inclusive): summer €20
  if (month === 7 || month === 8) return "summer";
  // Sep 1 – Dec 22 (inclusive): autumn €18
  if (month >= 9 && month <= 12) return "autumn";

  return "autumn";
}

// Price per person per night based on season
export function getPricePerPerson(date: Date): number {
  const season = getSeason(date);
  switch (season) {
    case "holiday": return 22;
    case "winter": return 16;
    case "spring": return 18;
    case "summer": return 20;
    case "autumn": return 18;
    default: return 18;
  }
}

// Child price (3-12 years): flat €12/person/night regardless of season
export const CHILD_PRICE_PER_NIGHT = 12;

export function calculateNightPrice(date: Date, _pricing: RoomPricing, guestCount: number): number {
  const pricePerPerson = getPricePerPerson(date);
  return pricePerPerson * guestCount;
}

export function calculateTotalPrice(
  checkIn: Date,
  checkOut: Date,
  pricing: RoomPricing,
  guestCount: number,
  childCount: number = 0
): { total: number; nights: number; breakdown: { date: string; price: number; pricePerPerson: number; childPrice: number; season: Season }[] } {
  const breakdown: { date: string; price: number; pricePerPerson: number; childPrice: number; season: Season }[] = [];
  let total = 0;
  const current = new Date(checkIn);
  let nights = 0;

  while (current < checkOut) {
    const season = getSeason(current);
    const pricePerPerson = getPricePerPerson(current);
    const adultPrice = pricePerPerson * guestCount;
    const childPrice = CHILD_PRICE_PER_NIGHT * childCount;
    const nightPrice = adultPrice + childPrice;

    breakdown.push({
      date: current.toISOString().split("T")[0],
      price: nightPrice,
      pricePerPerson,
      childPrice,
      season,
    });
    total += nightPrice;
    nights++;
    current.setDate(current.getDate() + 1);
  }

  return { total: Math.round(total * 100) / 100, nights, breakdown };
}