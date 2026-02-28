import { useRef, useState, useEffect } from 'react'
import Tracklist from "./Tracklist"
import AnalysisPanel from "./AnalysisPanel"
import TrackTable from "./TrackTable"
import OptimisationPanel from './OptimisationPanel'
import { Howl } from "howler" // more sophisticated audio playing


export default function MainPanel() {
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [trackData, setTrackData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('trackData')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // for upadting the trackData in sessionStorage when it changes.
  useEffect(() => {
    sessionStorage.setItem('trackData', JSON.stringify(trackData))
  }, [trackData])

  const currentSound = useRef(null)
  const [playingIndex, setPlayingIndex] = useState(null)

  const handlePlay = (index, file) => {
    if (currentSound.current) currentSound.current.stop()
    if (playingIndex === index) {
      setPlayingIndex(null)
    } else {
      currentSound.current = new Howl({
        src: [URL.createObjectURL(file)],
        format: ['mp3'],
        onend: () => setPlayingIndex(null) // so the equaliser stops when the track does
      })
      currentSound.current.play()
      setPlayingIndex(index)
    }
  }

  // for stopping music once the track data table appears
  useEffect(() => {
    if (trackData.length > 0) {
      if (currentSound.current) {
        currentSound.current.stop()
        currentSound.current = null
      }
      setTimeout(() => setPlayingIndex(null), 0)
    }
  }, [trackData])

  const handleFileUpload = (e) => {
    // e.target is the DOM node of the input element
    const selectedFiles = Array.from(e.target.files)
    // so empty re-upload doesn't reset the page
    if (selectedFiles.length > 0) {
      // so music stops if currently playing
      if (currentSound.current) {
        currentSound.current.stop()
        currentSound.current = null
        setPlayingIndex(null)
      }
    }
    setFiles(selectedFiles) // stores File objects in React state
  }

  const handleRestart = () => {
    setFiles([])
    setTrackData([]) // sessionStorage should automatically update
  }

  return (
  <main className="main">
    <input
        type="file"
        multiple
        accept="audio/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    {trackData.length > 0 ? (
      <div>
        <TrackTable trackData={trackData} />
        <OptimisationPanel
          onRestart={handleRestart}
        />
      </div>
     ) : files.length === 0 ? (
      <button id="upload-button" onClick={() => fileInputRef.current.click()}>
        Upload Tracks
      </button>
    ) : (
      <div className="tracks-pane">
        <Tracklist
          files={files}
          playingIndex={playingIndex}
          onPlay={handlePlay}
        />
        <AnalysisPanel
          files={files}
          onTrackData={setTrackData}
          onReupload={() => fileInputRef.current.click()}
        />
      </div>
    )}
  </main>
  )
}

