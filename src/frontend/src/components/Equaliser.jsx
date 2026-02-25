const Equaliser = () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "16px" }}>
        {[1, 2, 3].map(i => (
            <div key={i} style={{
                width: "4px",
                backgroundColor: "#c9a227",
                borderRadius: "2px",
                animation: `equaliser 0.8s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.15}s`
            }} />
        ))}
    </div>
)

export default Equaliser
