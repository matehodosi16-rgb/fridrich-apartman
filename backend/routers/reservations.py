import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.reservations import ReservationsService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/reservations", tags=["reservations"])


# ---------- Pydantic Schemas ----------
class ReservationsData(BaseModel):
    """Entity data schema (for create/update)"""
    room_id: str
    check_in: date
    check_out: date
    guest_name: str
    guest_email: str
    guest_phone: str = None
    guests_count: int
    total_price: float
    status: str
    notes: str = None


class ReservationsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    room_id: Optional[str] = None
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None
    guests_count: Optional[int] = None
    total_price: Optional[float] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ReservationsResponse(BaseModel):
    """Entity response schema"""
    id: int
    room_id: str
    check_in: date
    check_out: date
    guest_name: str
    guest_email: str
    guest_phone: Optional[str] = None
    guests_count: int
    total_price: float
    status: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReservationsListResponse(BaseModel):
    """List response schema"""
    items: List[ReservationsResponse]
    total: int
    skip: int
    limit: int


class ReservationsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[ReservationsData]


class ReservationsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: ReservationsUpdateData


class ReservationsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[ReservationsBatchUpdateItem]


class ReservationsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=ReservationsListResponse)
async def query_reservationss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query reservationss with filtering, sorting, and pagination"""
    logger.debug(f"Querying reservationss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = ReservationsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        logger.debug(f"Found {result['total']} reservationss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying reservationss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=ReservationsListResponse)
async def query_reservationss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query reservationss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying reservationss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = ReservationsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} reservationss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying reservationss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=ReservationsResponse)
async def get_reservations(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single reservations by ID"""
    logger.debug(f"Fetching reservations with id: {id}, fields={fields}")
    
    service = ReservationsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Reservations with id {id} not found")
            raise HTTPException(status_code=404, detail="Reservations not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching reservations {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=ReservationsResponse, status_code=201)
async def create_reservations(
    data: ReservationsData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new reservations"""
    logger.debug(f"Creating new reservations with data: {data}")
    
    service = ReservationsService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create reservations")
        
        logger.info(f"Reservations created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating reservations: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating reservations: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[ReservationsResponse], status_code=201)
async def create_reservationss_batch(
    request: ReservationsBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple reservationss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} reservationss")
    
    service = ReservationsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} reservationss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[ReservationsResponse])
async def update_reservationss_batch(
    request: ReservationsBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple reservationss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} reservationss")
    
    service = ReservationsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} reservationss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=ReservationsResponse)
async def update_reservations(
    id: int,
    data: ReservationsUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing reservations"""
    logger.debug(f"Updating reservations {id} with data: {data}")

    service = ReservationsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Reservations with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Reservations not found")
        
        logger.info(f"Reservations {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating reservations {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating reservations {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_reservationss_batch(
    request: ReservationsBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple reservationss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} reservationss")
    
    service = ReservationsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} reservationss successfully")
        return {"message": f"Successfully deleted {deleted_count} reservationss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_reservations(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single reservations by ID"""
    logger.debug(f"Deleting reservations with id: {id}")
    
    service = ReservationsService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Reservations with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Reservations not found")
        
        logger.info(f"Reservations {id} deleted successfully")
        return {"message": "Reservations deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting reservations {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")