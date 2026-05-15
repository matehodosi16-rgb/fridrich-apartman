import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.reservations import Reservations

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class ReservationsService:
    """Service layer for Reservations operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Reservations]:
        """Create a new reservations"""
        try:
            obj = Reservations(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created reservations with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating reservations: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Reservations]:
        """Get reservations by ID"""
        try:
            query = select(Reservations).where(Reservations.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching reservations {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of reservationss"""
        try:
            query = select(Reservations)
            count_query = select(func.count(Reservations.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Reservations, field):
                        query = query.where(getattr(Reservations, field) == value)
                        count_query = count_query.where(getattr(Reservations, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Reservations, field_name):
                        query = query.order_by(getattr(Reservations, field_name).desc())
                else:
                    if hasattr(Reservations, sort):
                        query = query.order_by(getattr(Reservations, sort))
            else:
                query = query.order_by(Reservations.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching reservations list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Reservations]:
        """Update reservations"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Reservations {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated reservations {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating reservations {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete reservations"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Reservations {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted reservations {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting reservations {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Reservations]:
        """Get reservations by any field"""
        try:
            if not hasattr(Reservations, field_name):
                raise ValueError(f"Field {field_name} does not exist on Reservations")
            result = await self.db.execute(
                select(Reservations).where(getattr(Reservations, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching reservations by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Reservations]:
        """Get list of reservationss filtered by field"""
        try:
            if not hasattr(Reservations, field_name):
                raise ValueError(f"Field {field_name} does not exist on Reservations")
            result = await self.db.execute(
                select(Reservations)
                .where(getattr(Reservations, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Reservations.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching reservationss by {field_name}: {str(e)}")
            raise