export default function Header() {
  return (
    <header className="header" style={{ color: "6F73D2" }}>
      <div style={{display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center"}}>
        <img
          className="rotating-disc"
          src="favicon.ico"
          width="90"
          height="90"
          style={{justifySelf: "start", padding: "1rem"}}
        />
        <h1 className="gold-text">Set Architect</h1>
        <img
          className="rotating-disc"
          src="favicon.ico"
          width="90"
          height="90"
          style={{justifySelf: "end", padding: "1rem"}}
        />
      </div>
      <h2>Optimise your next DJ set</h2>
    </header>
  )
}
