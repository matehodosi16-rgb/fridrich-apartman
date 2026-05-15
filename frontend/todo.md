# Fridrich Apartman - Hotel Reservation System

## Design
- Keep existing color palette: #1B3A4B (dark blue), #C8956C (gold), #F9F6F2 (cream), #8A9BA8 (gray), #F5F0EB (light)
- Calendar UI: clean grid with color-coded dates (green=free, red=booked, blue=selected)
- Booking widget integrated into RoomDetail page
- Modern card-based layout with shadows and rounded corners

## Development Tasks
- [x] Create database tables (reservations) via BackendManager
- [x] Create backend edge function for availability check and booking creation (using auto-generated CRUD)
- [x] Create pricing data file (src/data/pricing.ts) with seasonal/weekend rates per room
- [x] Create BookingCalendar component with date selection and availability display
- [x] Create BookingForm component with guest details and price calculation
- [x] Integrate booking system into RoomDetail page
- [x] Add booking translations to i18n/translations.ts (SK, HU, CZ, PL)
- [x] Run lint and build, verify UI