from fastapi import FastAPI
from routers import tracks, health
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup — load model and threadlock once here rather than at module level
    yield  # app runs here
    # shutdown

# CORS Middleware?

app = FastAPI(lifespan=lifespan)
app.include_router(tracks.router)
app.include_router(health.router)
