import getTracksfromFiles from "../utils/file-utils"
import { useRef, useState } from "react"
import { Howl } from "howler" // more sophisticated audio playing
import Equaliser from "./Equaliser"

export default function Tracklist({ files }) {
    const tracks = getTracksfromFiles(files)
    const currentSound = useRef(null)
    const [playingIndex, setplayingIndex] = useState(null)

    const handlePlay = (index, file) => {
        if (currentSound.current) currentSound.current.stop()
        if (playingIndex === index) {
            setplayingIndex(null)
        } else {
        // what if the file isn't mp3?
        currentSound.current = new Howl({ src: [URL.createObjectURL(file)], format: ["mp3"] })
        currentSound.current.play()
        setplayingIndex(index)
        }
    }
    return (
    <div>
        <h3 className="gold-text">Tracks</h3>
        {tracks.map((track, index) => (
        <div key={index} style={{ borderBottom: "1px solid #b78727", padding: "8px 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => handlePlay(index, files[index])} title="Play track" style={{ background: "none", border: "none", cursor: "pointer", color: "#c9a227", padding: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
                </svg>
            </button>
            <span>{track}</span>
            {playingIndex === index && <Equaliser />}
        </div>
    ))}
    </div>
  )
}
