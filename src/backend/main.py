from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tracks, health
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup — load model and threadlock once here rather than at module level
    yield  # app runs here
    # shutdown

app = FastAPI(lifespan=lifespan, root_path="/api")  # matches the vite proxy

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tracks.router)
app.include_router(health.router)
