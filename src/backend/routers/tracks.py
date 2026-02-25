from fastapi import APIRouter
from fastapi import UploadFile, File
from backend.utils.audio_analyser import (
    perform_batch_audio_analysis_on_bytes,
    extract_track_title
)

router = APIRouter(prefix="/tracks", tags=["tracks"])


@router.post("/analysis")
async def analyse(files: list[UploadFile] = File(...)):
    print("\n\nFILES RECEIVED\n\n")
    track_names = []
    bytes_list = []
    for file in files:
        track_names.append(extract_track_title(file.filename))
        bytes_list.append(await file.read())

    return perform_batch_audio_analysis_on_bytes(track_names, bytes_list)
