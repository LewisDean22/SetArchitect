import { useRef, useState } from 'react'


export default function MainPanel() {
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])


  const handleFileUpload = (e) => {
  const selectedFiles = Array.from(e.target.files)
  setFiles(selectedFiles)  // stores File objects in React state
  }

  return (
  <main className="main">
    <input
      type="file"
      multiple
      accept="audio/*"
      onChange={handleFileUpload}
      style={{ display: 'none' }} // hidden so just a button
      ref={fileInputRef}
    />
    {files.length === 0 ? (
      <button id="upload-button" onClick={() => fileInputRef.current.click()}>
        Upload Tracks
      </button>
    ) : (
      <div className="split-pane">
        TRACKLIST GOES HERE...
        {/* Tracklist left, analysis controls right */}
      </div>
    )}
  </main>
  )
}
