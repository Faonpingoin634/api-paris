import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "./components/Table";
import MapView from "./components/map";
import ToggleButton from "./components/ToggleButton";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { fetchFontaines } from "./service/api";

function Fontaines() {
  const [fontaines, setFontaines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [arrondissement, setArrondissement] = useState("");
  const [disponible, setDisponible] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewState, setViewState] = useState("list");
  const navigate = useNavigate();

  const fetchData = (pageNum) => {
    setLoading(true);
    fetchFontaines(pageNum).then((data) => {
      setFontaines(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData(viewState === "list" ? 0 : undefined);
  }, [viewState]);

  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    fetchData(next);
  };

  const prevPage = () => {
    if (page === 0) return;
    const prev = page - 1;
    setPage(prev);
    fetchData(prev);
  };

  const filteredFontaines = fontaines.filter((item) => {
    const fields = item.fields || item;

    if (arrondissement && fields.commune !== arrondissement) return false;
    if (disponible && fields.dispo !== disponible) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesType = fields.type_objet?.toLowerCase().includes(term);
      const matchesModele = fields.modele?.toLowerCase().includes(term);
      const matchesAdresse = `${fields.no_voirie_pair || fields.no_voirie_impair || ""} ${fields.voie || ""}`.toLowerCase().includes(term);
      const matchesCommune = fields.commune?.toLowerCase().includes(term);
      if (!matchesType && !matchesModele && !matchesAdresse && !matchesCommune) return false;
    }
    return true;
  });

  const columns = ["Type d'objet", "Modèle", "Adresse", "Commune", "Disponible", "Coordonnées"];

  const rows = filteredFontaines.map((item) => {
    const fields = item.fields || item;
    return [
      fields.type_objet || "Non précisé",
      fields.modele || "Non précisé",
      `${fields.no_voirie_pair || fields.no_voirie_impair || ""} ${fields.voie || "Non précisée"}`,
      fields.commune || "Non précisée",
      fields.dispo || "Non précisé",
      `${fields.geo_point_2d?.lat || "-"}, ${fields.geo_point_2d?.lon || "-"}`,
    ];
  });

  return (
    <div className="container">
      <h1>Fontaines à boire à Paris</h1>

      <div className="search-bar">
        <label>Rechercher : </label>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher" />
      </div>

      <div className="controls-bar">
        <div className="left-controls">
          <ToggleButton view={viewState} setView={setViewState} />

          <div className="filters">
            <label>Arrondissement : </label>
            <select value={arrondissement} onChange={(e) => setArrondissement(e.target.value)}>
              <option value="">Tous</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={`PARIS ${i + 1}EME ARRONDISSEMENT`}>
                  {i + 1}e
                </option>
              ))}
            </select>

            <label style={{ marginLeft: "20px" }}>Disponible : </label>
            <select value={disponible} onChange={(e) => setDisponible(e.target.value)}>
              <option value="">Tous</option>
              <option value="OUI">OUI</option>
              <option value="NON">NON</option>
            </select>
          </div>
        </div>

        <button className="back-button" onClick={() => navigate("/")}>
          Retour à l'accueil
        </button>
      </div>

      {viewState === "list" ? (
        <Table columns={columns} rows={rows} loading={loading} />
      ) : (
        <MapView data={filteredFontaines.map((item) => {
          const fields = item.fields || item;
          return {
            identifiant: fields.gid,
            title: fields.type_objet,
            description: fields.voie || "Non précisée",
            geolocation: [fields.geo_point_2d?.lat, fields.geo_point_2d?.lon],
          };
        })} />
      )}

      {!loading && fontaines.length > 0 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={page === 0}>Page précédente</button>
          <span>Page {page + 1}</span>
          <button onClick={nextPage}>Page suivante</button>
        </div>
      )}

      <footer className="footer">
        <p>© 2025 Paris Fraicheur - Données provenant de la Mairie de Paris</p>
      </footer>
    </div>
  );
}

export default Fontaines;