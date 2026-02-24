import { useRef, useState, useEffect } from 'react'
import Tracklist from "./Tracklist"
import AnalysisPanel from "./AnalysisPanel"


export default function MainPanel() {
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])

  const handleFileUpload = (e) => {
    // e.target is the DOM node of the input element
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)  // stores File objects in React state
  }

  // for logging during dev
  useEffect(() => {
    console.log(files)  // runs when files updates
  }, [files])

  return (
  <main className="main">
    <input
      type="file"
      multiple
      accept="audio/*" // all audio MIME types
      onChange={handleFileUpload}
      style={{ display: 'none' }} // hidden so just a button
      ref={fileInputRef}
    />
    {files.length === 0 ? (
      <button id="upload-button" onClick={() => fileInputRef.current.click()}>
        Upload Tracks
      </button>
    ) : (
      <div className="tracks-pane">
        <Tracklist files={files}/>
        <AnalysisPanel />
      </div>
    )}
  </main>
  )
}

