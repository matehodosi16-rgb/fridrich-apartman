from core.database import Base
from datetime import datetime
from sqlalchemy import Column, Date, DateTime, Float, Integer, String


class Reservations(Base):
    __tablename__ = "reservations"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    room_id = Column(String, nullable=False)
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=False)
    guest_phone = Column(String, nullable=True)
    guests_count = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)