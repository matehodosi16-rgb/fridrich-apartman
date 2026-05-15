import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from services.email_service import send_booking_confirmation

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/booking", tags=["booking"])


class BookingEmailRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    room_name: str
    check_in: str
    check_out: str
    guests: str
    message: str = ""


class BookingEmailResponse(BaseModel):
    success: bool
    message: str


@router.post("/send-confirmation", response_model=BookingEmailResponse)
async def send_confirmation_email(data: BookingEmailRequest):
    """Send booking confirmation emails to both guest and apartment owner."""
    try:
        result = await send_booking_confirmation(
            guest_email=data.email,
            guest_name=data.name,
            room_name=data.room_name,
            check_in=data.check_in,
            check_out=data.check_out,
            guests=data.guests,
            phone=data.phone,
            message=data.message,
        )
        return BookingEmailResponse(**result)
    except ValueError as e:
        logger.error(f"Booking email error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error sending booking email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send confirmation emails")