from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/live")
async def liveness():
    """Is the server running at all?"""
    return {"status": "ok"}


@router.get("/ready")
async def readiness():
    """Is the server ready to handle requests?"""
    return {
        "status": "ready"
    }


# TODO - implement these!
