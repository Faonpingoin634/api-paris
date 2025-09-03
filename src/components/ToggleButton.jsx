import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ToggleButton({ view, setView }) {
  return (
    <div style={{ display: "flex", gap: "0" }}>
      <button
        onClick={() => setView("list")}
        className={`toggle ${view === "list" ? "active" : ""}`}>
        <FontAwesomeIcon
          icon="fa-solid fa-table"
          size="lg"
          className="toggleicon"
        />
      </button>

      <button
        onClick={() => setView("map")}
        className={`toggle ${view === "map" ? "active" : ""}`}>
        <FontAwesomeIcon
          icon="fa-solid fa-map"
          size="lg"
          className="toggleicon"
        />
      </button>
    </div>
  );
}
