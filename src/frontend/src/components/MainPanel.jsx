import { useRef, useState } from 'react'
import Tracklist from "./Tracklist"
import AnalysisPanel from "./AnalysisPanel"


export default function MainPanel() {
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])

  const handleFileUpload = (e) => {
    // e.target is the DOM node of the input element
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) { // so empty re-upload doesn't reset the page
    setFiles(selectedFiles) // stores File objects in React state
    }
  }

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
        <AnalysisPanel files={files} onReupload={() => fileInputRef.current.click()}/>
      </div>
    )}
  </main>
  )
}

