from pathlib import Path
import threading
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
import numpy as np
import librosa
from deeprhythm import DeepRhythmPredictor
from mutagen import File

TEST_FOLDER_PATH = r"C:\Users\lewis\Desktop\Mixes\Mix-1"

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


@dataclass
class TrackAnalysis:
    track_name: str
    bpm: int
    key: str
    mode: str


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
        correlations.append((NOTE_NAMES[i], "major", major_corr))
        correlations.append((NOTE_NAMES[i], "minor", minor_corr))

    best_match = max(correlations, key=lambda x: x[2])
    return best_match[0], best_match[1]  # e.g. ("A", "minor")


def detect_audio_tempo(audio: np.ndarray, sr: int) -> tuple[float, float]:
    return _model.predict_from_audio(audio, sr, include_confidence=True)
    # Could do some validation that confidence is high enough to give
    # to a user.


def perform_audio_analysis(filepath: str) -> TrackAnalysis:
    audio, sr = load_audio(filepath)
    key, mode = detect_audio_key(audio, sr)
    with _thread_lock:
        tempo, confidence = detect_audio_tempo(audio, sr)
    return TrackAnalysis(
                track_name=extract_track_title(filepath),
                bpm=round(tempo),
                key=key,
                mode=mode
            )


def perform_batch_audio_analysis(filepaths: list[str],
                                 max_workers: int = 3
                                 ) -> list[TrackAnalysis]:
    # TODO - update so one file faulting doesn't abort the whole batch
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        track_analyses = list(executor.map(perform_audio_analysis, filepaths))

    return track_analyses


if __name__ == "__main__":
    filepaths = read_setlist_filepaths(TEST_FOLDER_PATH)
    track_analyses = perform_batch_audio_analysis(filepaths)
    print(track_analyses)
