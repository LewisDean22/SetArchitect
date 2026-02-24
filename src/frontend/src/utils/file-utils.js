export default function getTracksFromFiles(files) {
  // maps files to track names and slices to remove file extensions
  return files.map(file => file.name.slice(0, file.name.lastIndexOf('.')))
}
