"""Vercel Serverless Function: Send booking confirmation emails via Gmail SMTP."""

import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from http.server import BaseHTTPRequestHandler
from datetime import datetime

GMAIL_ADDRESS = os.environ.get("GMAIL_USER", "fridrichapartman@gmail.com")
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")

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


def send_booking_emails(data):
    """Send booking confirmation emails to both guest and owner."""
    if not GMAIL_APP_PASSWORD:
        return {"success": False, "message": "Email service not configured"}

    guest_name = data.get("name", "")
    guest_email = data.get("email", "")
    phone = data.get("phone", "")
    room_name = data.get("room_name", "")
    check_in = data.get("check_in", "")
    check_out = data.get("check_out", "")
    guests = data.get("guests", "1")
    message = data.get("message", "")

    # Generate iCal content
    ics_content = generate_ics(guest_name, room_name, check_in, check_out, guests, phone, message)

    # Email to apartment owner
    owner_msg = MIMEMultipart()
    owner_msg["From"] = GMAIL_ADDRESS
    owner_msg["To"] = GMAIL_ADDRESS
    owner_msg["Subject"] = f"[Nová rezervácia] {guest_name} – {room_name}"
    owner_body = (
        f"Nová žiadosť o rezerváciu!\n\n"
        f"Podrobnosti rezervácie\n"
        f"{'=' * 40}\n\n"
        f"Meno: {guest_name}\n"
        f"E-mail: {guest_email}\n"
        f"Telefón: {phone or '—'}\n"
        f"Izba: {room_name}\n"
        f"Príchod: {check_in}\n"
        f"Odchod: {check_out}\n"
        f"Počet hostí: {guests}\n\n"
        f"Správa:\n{message or '—'}\n"
    )
    owner_msg.attach(MIMEText(owner_body, "plain", "utf-8"))

    owner_ics = MIMEBase("text", "calendar", method="PUBLISH")
    owner_ics.set_payload(ics_content.encode("utf-8"))
    encoders.encode_base64(owner_ics)
    owner_ics.add_header("Content-Disposition", "attachment", filename="rezervacia.ics")
    owner_msg.attach(owner_ics)

    # Confirmation email to guest
    guest_msg = MIMEMultipart()
    guest_msg["From"] = GMAIL_ADDRESS
    guest_msg["To"] = guest_email
    guest_msg["Subject"] = "Potvrdenie rezervácie – Fridrich Apartman"
    guest_body = (
        f"Vážený/á {guest_name},\n\n"
        f"Ďakujeme za Vašu žiadosť o rezerváciu vo Fridrich Apartman!\n"
        f"Vašu požiadavku sme prijali a čoskoro sa Vám ozveme.\n\n"
        f"Podrobnosti Vašej rezervácie:\n"
        f"{'-' * 40}\n"
        f"Izba: {room_name}\n"
        f"Príchod: {check_in}\n"
        f"Odchod: {check_out}\n"
        f"Počet hostí: {guests}\n"
        f"{'-' * 40}\n\n"
        f"Rezerváciu si môžete pridať do kalendára pomocou priloženého .ics súboru.\n\n"
        f"Ak máte akékoľvek otázky, prosím odpoveďte na tento e-mail.\n\n"
        f"S pozdravom,\n"
        f"Fridrich Apartman\n"
        f"fridrichapartman@gmail.com\n"
    )
    guest_msg.attach(MIMEText(guest_body, "plain", "utf-8"))

    guest_ics = MIMEBase("text", "calendar", method="PUBLISH")
    guest_ics.set_payload(ics_content.encode("utf-8"))
    encoders.encode_base64(guest_ics)
    guest_ics.add_header("Content-Disposition", "attachment", filename="rezervacia.ics")
    guest_msg.attach(guest_ics)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_ADDRESS, GMAIL_ADDRESS, owner_msg.as_string())
            server.sendmail(GMAIL_ADDRESS, guest_email, guest_msg.as_string())
        return {"success": True, "message": "Emails sent successfully"}
    except smtplib.SMTPAuthenticationError:
        return {"success": False, "message": "Email authentication failed"}
    except Exception as e:
        return {"success": False, "message": f"Failed to send emails: {str(e)}"}


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "message": "Invalid JSON"}).encode())
            return

        result = send_booking_emails(data)
        status_code = 200 if result["success"] else 500

        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()