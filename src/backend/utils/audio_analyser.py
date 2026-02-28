from pathlib import Path
import io
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import numpy as np
import librosa
from deeprhythm import DeepRhythmPredictor
from mutagen import File
from backend.schemas import Track, Tracklist

# Private globals
_model = DeepRhythmPredictor()
_thread_lock = threading.Lock()

SUPPORTED_EXTENSIONS = {'.mp3', '.wav', '.flac', '.ogg', '.aiff'}

# Key profiles (Krumhansl-Schmuckler)
MAJOR_PROFILE = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09,
                          2.52, 5.19, 2.39, 3.66, 2.29, 2.88],
                         dtype=np.float32)
MINOR_PROFILE = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53,
                          2.54, 4.75, 3.98, 2.69, 3.34, 3.17],
                         dtype=np.float32)
NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F',
              'F#', 'G', 'G#', 'A', 'A#', 'B']


CAMELOT_MAP = {
    # Major keys (B wheel)
    "C Major":  "8B",
    "G Major":  "9B",
    "D Major":  "10B",
    "A Major":  "11B",
    "E Major":  "12B",
    "B Major":  "1B",
    "F# Major": "2B",
    "C# Major": "3B",
    "G# Major": "4B",
    "D# Major": "5B",
    "A# Major": "6B",
    "F Major":  "7B",

    # minor keys (A wheel)
    "A minor":  "8A",
    "E minor":  "9A",
    "B minor":  "10A",
    "F# minor": "11A",
    "C# minor": "12A",
    "G# minor": "1A",
    "D# minor": "2A",
    "A# minor": "3A",
    "F minor":  "4A",
    "C minor":  "5A",
    "G minor":  "6A",
    "D minor":  "7A",
}


def read_setlist_filepaths(mix_directory: str) -> list[str]:
    # isfile() is needed such tha subdirectory names aren't returned
    return [str(p) for p in Path(mix_directory).iterdir()
            if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
            ]


def extract_track_title(filepath: str) -> str:
    return Path(filepath).stem


def load_audio(filepath: str) -> tuple[np.ndarray, int]:
    audio_file = File(filepath)
    audio_duration = audio_file.info.length
    offset = audio_duration * 0.25
    analysis_duration = min(180, audio_duration - offset)
    return librosa.load(filepath, offset=offset,
                        duration=analysis_duration)
    # audio amplitude and sampling rate


def detect_audio_key(audio: np.ndarray, sr: int) -> tuple[str, str]:
    # Median-filtering harmonic percussive source separation (HPSS).
    # i.e., removes percussion before harmonic analysis
    harmonic_audio, _ = librosa.effects.hpss(audio)
    chroma = librosa.feature.chroma_cens(y=harmonic_audio, sr=sr,
                                         hop_length=256)
    chroma_mean = chroma.mean(axis=1).astype(np.float32)  # take time average

    correlations = []
    for i in range(12):
        rolled = np.roll(chroma_mean, -i)  # rotate to test each root note
        major_corr = np.corrcoef(rolled, MAJOR_PROFILE)[0, 1]
        minor_corr = np.corrcoef(rolled, MINOR_PROFILE)[0, 1]
        correlations.append((NOTE_NAMES[i], "Major", major_corr))
        correlations.append((NOTE_NAMES[i], "minor", minor_corr))

    best_match = max(correlations, key=lambda x: x[2])
    return best_match[0], best_match[1]  # e.g. ("A", "minor")


def get_camelot_from_key(key: str, mode: str) -> str:
    return CAMELOT_MAP[key+" "+mode]


def detect_audio_tempo(audio: np.ndarray, sr: int) -> tuple[float, float]:
    return _model.predict_from_audio(audio, sr, include_confidence=True)
    # Could do some validation that confidence is high enough to give
    # to a user.


def perform_audio_analysis_on_file(filepath: str) -> Track:
    audio, sr = load_audio(filepath)
    key, mode = detect_audio_key(audio, sr)
    with _thread_lock:
        tempo, confidence = detect_audio_tempo(audio, sr)
    return Track(
                track_name=extract_track_title(filepath),
                bpm=round(tempo),
                key=key,
                mode=mode,
                camelot=get_camelot_from_key(key, mode)
            )


def perform_audio_analysis_on_bytes(track_name: str, bytes: bytes) -> Track:
    audio, sr = load_audio(io.BytesIO(bytes))
    key, mode = detect_audio_key(audio, sr)
    with _thread_lock:
        tempo, confidence = detect_audio_tempo(audio, sr)
    return Track(
                track_name=track_name,
                bpm=round(tempo),
                key=key,
                mode=mode,
                camelot=get_camelot_from_key(key, mode)
            )


def perform_batch_audio_analysis_on_files(filepaths: list[str],
                                          max_workers: int = 3
                                          ) -> Tracklist:
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(perform_audio_analysis_on_file, f):
                   f for f in filepaths}

        for future in as_completed(futures):
            filename = futures[future]
            try:
                results.append(future.result())
            except Exception as e:
                print(f"{filename} failed: {e}")
                # switch to raising error to FastAPI?
    return results


def perform_batch_audio_analysis_on_bytes(track_names: list[str],
                                          bytes_list: list[bytes],
                                          max_workers: int = 3
                                          ) -> Tracklist:
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(perform_audio_analysis_on_bytes, name, b):
                   name for name, b in zip(track_names, bytes_list)}

        for future in as_completed(futures):
            try:
                results.append(future.result())
            except Exception as e:
                track_name = futures[future]
                print(f"{track_name} failed: {e}")
                # switch to raising error to FastAPI?
    return results
