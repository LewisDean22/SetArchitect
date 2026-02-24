export default function AnalysisPanel() {
    return (
        <div className="analysis-panel">
            <div>
                <h3>What's in the analysis?</h3>
                <p>This analysis identifies the BPM, key and Camelot of the tracks. Upon completion, you have the option to manually correct any identified features. Then you can begin tracklist order optimisation.</p>
            </div>
            <div style={{flex: 0.25}}>
                <button id="analysis-button">Perform analysis</button>
            </div>
        </div>
    )
}
