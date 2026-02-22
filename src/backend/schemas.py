from pydantic import BaseModel, Field
from typing import Optional

# Add examples for OpenAPI
# TODO - rethink after making some user stories


# --- Shared ---
class TrackAnalysisBase(BaseModel):
    bpm: int = Field(gt=0, lt=300)
    key: str
    mode: str


# --- Responses ---
class TrackResponse(BaseModel):
    """
    Fields needed since track_name required (... arg)
    """
    id: str
    track_name: str
    filepath: str


class TrackAnalysisResponse(TrackAnalysisBase):
    track_id: str
    track_name: str


# --- Requests ---
class TrackAnalysisPatch(BaseModel):
    bpm: Optional[int] = Field(default=None, gt=0, lt=300)
    key: Optional[str] = None
    mode: Optional[str] = None
    # All optional — PATCH should only update what's provided


class DeleteSelectionRequest(BaseModel):
    ids: list[str]
