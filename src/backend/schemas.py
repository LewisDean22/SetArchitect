from pydantic import BaseModel


class Track(BaseModel):
    """
    Originally all but the first parameters were optional,
    but this is first used as a response model after audio analysis,
    so bpm, key and mode will always be populated.
    """
    track_name: str
    bpm: int
    key: str
    mode: str
    camelot: str


class Tracklist(BaseModel):
    tracks: list[Track]
