function getTrackfromFile(file) {
  return file.name.slice(0, file.name.lastIndexOf('.'))
}

export default function getTracksFromFiles(files) {
  // maps files to track names and slices to remove file extensions
  return files.map(file => getTrackfromFile(file))
}
