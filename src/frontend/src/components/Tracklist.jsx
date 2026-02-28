import getTracksfromFiles from "../utils/file-utils"
import Equaliser from "./Equaliser"
import { PlayIcon } from "./Icons"

export default function Tracklist({ files, playingIndex, onPlay }) {
    const tracks = getTracksfromFiles(files)

    return (
    <div>
        <h3 className="gold-text">Tracks</h3>
        {tracks.map((track, index) => (
        <div key={index} style={{ borderBottom: "1px solid #b78727", padding: "8px 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => onPlay(index, files[index])} title="Play track" style={{ background: "none", border: "none", cursor: "pointer", color: "#c9a227", padding: 0 }}>
                <PlayIcon />
            </button>
            <span>{track}</span>
            {playingIndex === index && <Equaliser />}
        </div>
    ))}
    </div>
  )
}
