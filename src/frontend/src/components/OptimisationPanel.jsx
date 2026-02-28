import { RestartIcon, OptimisationIcon } from "./Icons"

export default function OptimisationPanel ({ onRestart }) {
    return (
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center"}}>
            <button className="gold-button" onClick={onRestart}>
                <RestartIcon />
                <div>Restart set</div>
            </button>

            <button className="gold-button" onClick={() => {console.log("TEST")}}>
                <OptimisationIcon />
                <div>Perform optimisation</div>
            </button>
        </div>
    )
}
