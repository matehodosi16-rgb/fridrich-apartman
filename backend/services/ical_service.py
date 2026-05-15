"""iCal (.ics) file generation service for booking events."""

import logging
from datetime import datetime

logger = logging.getLogger(__name__)

APARTMENT_NAME = "Fridrich Apartman"
APARTMENT_LOCATION = "Brusno 346, 976 62 Brusno, Slovensko"
APARTMENT_EMAIL = "fridrichapartman@gmail.com"


def generate_ics(
    guest_name: str,
    room_name: str,
    check_in: str,
    check_out: str,
    guests: str,
    phone: str = "",
    message: str = "",
) -> str:
    """Generate an iCal (.ics) file content for a booking (Slovak labels).

    Args:
        guest_name: Name of the guest
        room_name: Name of the room
        check_in: Check-in date (YYYY-MM-DD)
        check_out: Check-out date (YYYY-MM-DD)
        guests: Number of guests
        phone: Guest phone number
        message: Additional message

    Returns:
        str: iCal file content
    """
    # Parse dates
    ci = check_in.replace("-", "")
    co = check_out.replace("-", "")

    # Generate unique ID
    now = datetime.utcnow()
    uid = f"rezervacia-{ci}-{co}-{now.strftime('%Y%m%d%H%M%S')}@fridrichapartman.com"
    dtstamp = now.strftime("%Y%m%dT%H%M%SZ")

    # Build description in Slovak
    desc_parts = [
        f"Hosť: {guest_name}",
        f"Izba: {room_name}",
        f"Počet hostí: {guests}",
    ]
    if phone:
        desc_parts.append(f"Telefón: {phone}")
    if message:
        desc_parts.append(f"Poznámka: {message}")
    desc_parts.append(f"Kontakt: {APARTMENT_EMAIL}")

    description = "\\n".join(desc_parts)

    summary = f"{APARTMENT_NAME} – {room_name}"

    ics_content = (
        "BEGIN:VCALENDAR\r\n"
        "VERSION:2.0\r\n"
        "PRODID:-//Fridrich Apartman//Rezervacia//SK\r\n"
        "CALSCALE:GREGORIAN\r\n"
        "METHOD:PUBLISH\r\n"
        "BEGIN:VEVENT\r\n"
        f"UID:{uid}\r\n"
        f"DTSTAMP:{dtstamp}\r\n"
        f"DTSTART;VALUE=DATE:{ci}\r\n"
        f"DTEND;VALUE=DATE:{co}\r\n"
        f"SUMMARY:{summary}\r\n"
        f"DESCRIPTION:{description}\r\n"
        f"LOCATION:{APARTMENT_LOCATION}\r\n"
        f"ORGANIZER;CN={APARTMENT_NAME}:mailto:{APARTMENT_EMAIL}\r\n"
        "STATUS:CONFIRMED\r\n"
        "TRANSP:OPAQUE\r\n"
        "END:VEVENT\r\n"
        "END:VCALENDAR\r\n"
    )

    return ics_content


def generate_google_calendar_url(
    room_name: str,
    check_in: str,
    check_out: str,
    guests: str,
    guest_name: str = "",
) -> str:
    """Generate a Google Calendar event URL (Slovak details).

    Args:
        room_name: Name of the room
        check_in: Check-in date (YYYY-MM-DD)
        check_out: Check-out date (YYYY-MM-DD)
        guests: Number of guests
        guest_name: Name of the guest

    Returns:
        str: Google Calendar URL
    """
    import urllib.parse

    ci = check_in.replace("-", "")
    co = check_out.replace("-", "")

    title = f"{APARTMENT_NAME} – {room_name}"
    details = f"Hosť: {guest_name}\\nPočet hostí: {guests}\\nKontakt: {APARTMENT_EMAIL}"
    location = APARTMENT_LOCATION

    params = {
        "action": "TEMPLATE",
        "text": title,
        "dates": f"{ci}/{co}",
        "details": details,
        "location": location,
        "sf": "true",
    }

    base_url = "https://www.google.com/calendar/render"
    query_string = urllib.parse.urlencode(params)
    return f"{base_url}?{query_string}"