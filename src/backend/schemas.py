from pydantic import BaseModel


class TrackAnalysis(BaseModel):
    """
    Originally all but the first parameters were optional,
    but this is first used as a response model after audio analysis,
    so bpm, key and mode will always be populated.
    """
    track_name: str
    bpm: int
    key: str
    mode: str


class TracklistAnalysis(BaseModel):
    tracks: list[TrackAnalysis]
