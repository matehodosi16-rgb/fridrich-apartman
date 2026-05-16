"""Vercel Serverless Function: Generate and download iCal (.ics) files."""

import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime

APARTMENT_NAME = "Fridrich Apartman"
APARTMENT_LOCATION = "Brusno 346, 976 62 Brusno, Slovensko"
APARTMENT_EMAIL = "fridrichapartman@gmail.com"


def generate_ics(guest_name, room_name, check_in, check_out, guests, phone="", message=""):
    """Generate iCal (.ics) content for a booking."""
    ci = check_in.replace("-", "")
    co = check_out.replace("-", "")
    now = datetime.utcnow()
    uid = f"rezervacia-{ci}-{co}-{now.strftime('%Y%m%d%H%M%S')}@fridrichapartman.com"
    dtstamp = now.strftime("%Y%m%dT%H%M%SZ")

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


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)

        guest_name = params.get("guest_name", [""])[0]
        room_name = params.get("room_name", [""])[0]
        check_in = params.get("check_in", [""])[0]
        check_out = params.get("check_out", [""])[0]
        guests = params.get("guests", ["1"])[0]
        phone = params.get("phone", [""])[0]
        message = params.get("message", [""])[0]

        if not all([guest_name, room_name, check_in, check_out]):
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Missing required parameters"}).encode())
            return

        ics_content = generate_ics(guest_name, room_name, check_in, check_out, guests, phone, message)

        self.send_response(200)
        self.send_header("Content-Type", "text/calendar")
        self.send_header("Content-Disposition", "attachment; filename=fridrich-booking.ics")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(ics_content.encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()