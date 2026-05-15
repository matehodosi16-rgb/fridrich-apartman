import logging
from fastapi import APIRouter, Query
from fastapi.responses import Response

from services.ical_service import generate_ics, generate_google_calendar_url

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ical", tags=["ical"])


@router.get("/download")
async def download_ics(
    guest_name: str = Query(..., description="Guest name"),
    room_name: str = Query(..., description="Room name"),
    check_in: str = Query(..., description="Check-in date (YYYY-MM-DD)"),
    check_out: str = Query(..., description="Check-out date (YYYY-MM-DD)"),
    guests: str = Query("1", description="Number of guests"),
    phone: str = Query("", description="Guest phone"),
    message: str = Query("", description="Additional message"),
):
    """Download an iCal (.ics) file for a booking."""
    ics_content = generate_ics(
        guest_name=guest_name,
        room_name=room_name,
        check_in=check_in,
        check_out=check_out,
        guests=guests,
        phone=phone,
        message=message,
    )

    return Response(
        content=ics_content,
        media_type="text/calendar",
        headers={
            "Content-Disposition": "attachment; filename=fridrich-booking.ics",
        },
    )


@router.get("/google-url")
async def get_google_calendar_url(
    room_name: str = Query(..., description="Room name"),
    check_in: str = Query(..., description="Check-in date (YYYY-MM-DD)"),
    check_out: str = Query(..., description="Check-out date (YYYY-MM-DD)"),
    guests: str = Query("1", description="Number of guests"),
    guest_name: str = Query("", description="Guest name"),
):
    """Get a Google Calendar URL for a booking."""
    url = generate_google_calendar_url(
        room_name=room_name,
        check_in=check_in,
        check_out=check_out,
        guests=guests,
        guest_name=guest_name,
    )
    return {"url": url}