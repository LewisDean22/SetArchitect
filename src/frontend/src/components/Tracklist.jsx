import getTracksfromFiles from "../utils/file-utils"

export default function Tracklist({ files }) {
    const tracks = getTracksfromFiles(files)
    return (
    <div>
        <h3>Tracks</h3>
        <ol>
            {tracks.map(track => (
                <li key={track}>
                    {track}
                    <hr />
                </li>
            ))}
        </ol>
    </div>
  )
}
