import { useState } from "react"
import { ClipLoader } from "react-spinners"
import { UploadIcon, AnalyseIcon } from "./Icons"


export default function AnalysisPanel({ files, onTrackData, onReupload }) {
    const [isLoading, setLoading] = useState(false)

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
            onTrackData(data)
        }
        console.log(data)
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
                <button className="gold-button" onClick={onReupload}>
                    <UploadIcon />
                    <div>Re-upload</div>
                </button>

                <button className="gold-button" onClick={performAnalysis}>
                    <AnalyseIcon />
                    <div>Perform analysis</div>
                </button>
            </div>
            {isLoading && (
                <div style={{ paddingTop: "2rem" }}>
                    <ClipLoader color="#c9a227" speedMultiplier={0.5} loading={isLoading} cssOverride={{ borderWidth: "5px" }}/>
                </div>
            )
            }
        </div>
    )
}


