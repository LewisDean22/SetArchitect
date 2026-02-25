export default function AnalysisPanel({ onReupload }) {
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

                <button className="analysis-button">
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
                            // d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                            d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                        />
                    </svg>
                    <div>Perform analysis</div>
                </button>
            </div>
        </div>
    )
}


