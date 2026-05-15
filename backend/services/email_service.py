import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

from services.ical_service import generate_ics

logger = logging.getLogger(__name__)

GMAIL_ADDRESS = os.environ.get("GMAIL_USER", "fridrichapartman@gmail.com")
GMAIL_APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")


async def send_booking_confirmation(
    guest_email: str,
    guest_name: str,
    room_name: str,
    check_in: str,
    check_out: str,
    guests: str,
    phone: str = "",
    message: str = "",
) -> dict:
    """Send booking confirmation emails to both the guest and the apartment owner (in Slovak)."""
    
    if not GMAIL_APP_PASSWORD:
        logger.error("GMAIL_APP_PASSWORD not configured")
        raise ValueError("Email service not configured")

    # Generate iCal content
    ics_content = generate_ics(
        guest_name=guest_name,
        room_name=room_name,
        check_in=check_in,
        check_out=check_out,
        guests=guests,
        phone=phone,
        message=message,
    )

    # --- Email to apartment owner (Slovak) ---
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

    # Attach .ics to owner email
    owner_ics_attachment = MIMEBase("text", "calendar", method="PUBLISH")
    owner_ics_attachment.set_payload(ics_content.encode("utf-8"))
    encoders.encode_base64(owner_ics_attachment)
    owner_ics_attachment.add_header(
        "Content-Disposition", "attachment", filename="rezervacia.ics"
    )
    owner_msg.attach(owner_ics_attachment)

    # --- Confirmation email to guest (Slovak) ---
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

    # Attach .ics to guest email
    guest_ics_attachment = MIMEBase("text", "calendar", method="PUBLISH")
    guest_ics_attachment.set_payload(ics_content.encode("utf-8"))
    encoders.encode_base64(guest_ics_attachment)
    guest_ics_attachment.add_header(
        "Content-Disposition", "attachment", filename="rezervacia.ics"
    )
    guest_msg.attach(guest_ics_attachment)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            # Send to owner
            server.sendmail(GMAIL_ADDRESS, GMAIL_ADDRESS, owner_msg.as_string())
            # Send to guest
            server.sendmail(GMAIL_ADDRESS, guest_email, guest_msg.as_string())
        
        logger.info(f"Booking emails sent successfully for {guest_name} ({guest_email})")
        return {"success": True, "message": "Emails sent successfully"}
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP authentication failed: {e}")
        raise ValueError("Email authentication failed. Please check credentials.")
    except Exception as e:
        logger.error(f"Failed to send emails: {e}")
        raise ValueError(f"Failed to send emails: {str(e)}")