import numpy as np
import librosa
from deeprhythm import DeepRhythmPredictor


TEST_FILEPATH = r"C:\Users\lewis\Desktop\Mixes\Mix-1\Bertrand Burgalat - Etranges Nuages (Yuksek Remix).mp3"

# Key profiles (Krumhansl-Schmuckler)
MAJOR_PROFILE = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09,
                          2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
MINOR_PROFILE = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53,
                          2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F',
              'F#', 'G', 'G#', 'A', 'A#', 'B']


def load_audio(filepath: str):
    """
    Higher order function to abstract away the details of
    loading the audio in.
    """
    return librosa.load(filepath)  # audio amplitude and sampling rate


def detect_audio_key(y, sr) -> tuple[str, str]:
    # Median-filtering harmonic percussive source separation (HPSS).
    # i.e., removes percussion before harmonic analysis
    y_harmonic, _ = librosa.effects.hpss(y)
    chroma = librosa.feature.chroma_cens(y=y_harmonic, sr=sr, hop_length=512)
    chroma_mean = chroma.mean(axis=1)  # take time average

    correlations = []
    for i in range(12):
        rolled = np.roll(chroma_mean, -i)  # rotate to test each root note
        major_corr = np.corrcoef(rolled, MAJOR_PROFILE)[0, 1]
        minor_corr = np.corrcoef(rolled, MINOR_PROFILE)[0, 1]
        correlations.append((NOTE_NAMES[i], "major", major_corr))
        correlations.append((NOTE_NAMES[i], "minor", minor_corr))

    best = max(correlations, key=lambda x: x[2])
    return best[0], best[1]  # e.g. ("A", "minor")


def detect_audio_tempo(audio, sr):
    model = DeepRhythmPredictor()
    return model.predict_from_audio(audio, sr, include_confidence=True)
    # Could do some validation that confidence is high enough to give
    # to a user.


def perform_audio_analysis(filepath: str = TEST_FILEPATH):
    audio, sr = load_audio(filepath)
    key, mode = detect_audio_key(audio, sr)
    tempo, confidence = detect_audio_tempo(audio, sr)

    print(f"Tempo: {round(tempo)} BPM "
          f"at {confidence} confidence level")
    print(f"Key: {key} {mode}")


if __name__ == "__main__":
    perform_audio_analysis()
