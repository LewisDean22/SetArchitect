import { useState } from "react"
import { ClipLoader } from "react-spinners"


export default function AnalysisPanel({ files, onReupload }) {
    const [isLoading, setLoading] = useState(false)
    const [trackdata, setTrackdata] = useState([])

    const performAnalysis = async () => {
        const formData = new FormData()
        files.forEach(file => formData.append("files", file))

        setLoading(true)
        const response = await fetch("/api/tracks/analysis", {
            method: "POST",
            body: formData
        })
        const data = await response.json() // should match tracklist shape

        setLoading(false)
        if (data) {
            setTrackdata(data)
        }
    }

    return (
        <div className="analysis-panel">
            <div>
                <h3 className="gold-text">What's in the analysis?</h3>
                <p>This analysis identifies the <b>BPM</b>, <b>key</b> and <b>Camelot</b> of the tracks. Upon completion,
                    you have the option to manually correct any identified features.
                    Then you can begin tracklist order optimisation.</p>
            </div>
            <div style={{ paddingTop: "0.5rem", display: "flex", gap: "1.5rem"}}>
                <button className="analysis-button" onClick={onReupload}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        strokeWidth={2}
                        stroke="currentColor"
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                        />
                    </svg>
                    <div>Re-upload</div>
                </button>

                <button className="analysis-button" onClick={performAnalysis}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        width="25"
                        height="25"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                        />
                    </svg>
                    <div>Perform analysis</div>
                </button>
            </div>
            {isLoading && (
                <div style={{ paddingTop: "2rem" }}>
                    <ClipLoader color="#c9a227" speedMultiplier={0.5} loading={isLoading} cssOverride={{ borderWidth: "5px" }}/>
                </div>
            )
            }
            {!isLoading && trackdata.length !== 0 && (
                <ul>
                    {trackdata.map(track => (
                        <li key={track.track_name}>{track.track_name} - {track.bpm} BPM - {track.key} {track.mode}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}


