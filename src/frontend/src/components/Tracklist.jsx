import getTracksfromFiles from "../utils/file-utils"

export default function Tracklist({ files }) {
    const tracks = getTracksfromFiles(files)
    return (
    <div>
        <h3 className="gold-text">Tracks</h3>
        {tracks.map(track => (
                <div key={track} style={{ borderBottom: "1px solid #b78727", padding: "8px 0" }}>
                    {track}
                </div>
            ))}
    </div>
  )
}
