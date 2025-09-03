import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "./components/Table";
import MapView from "./components/map";
import ToggleButton from "./components/ToggleButton";
import "./App.css";
import { fetchEspaceVerts } from "./service/api";

const columns = [
  "Nom",
  "Type",
  "Adresse",
  "Arrondissement",
  "Proportion végétation haute",
  "Ouvert 24h",
  "Horaires",
];

function EspacesVerts() {
  const [espaces, setEspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [arrondissement, setArrondissement] = useState("");
  const [ouvert24h, setOuvert24h] = useState("");
  const [typeEspace, setTypeEspace] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewState, setViewState] = useState("list"); // "list" | "map"
  const navigate = useNavigate();

  const fetchData = (pageNum) => {
    setLoading(true);
    fetchEspaceVerts(pageNum).then((data) => {
      setEspaces(data);
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

  const filteredEspaces = espaces.filter((item) => {
    const fields = item.fields || item;

    if (arrondissement && fields.arrondissement !== arrondissement) return false;

    if (ouvert24h) {
      const isOpen = fields.ouvert_24h?.toString().toLowerCase() === "oui";
      if (ouvert24h === "oui" && !isOpen) return false;
      if (ouvert24h === "non" && isOpen) return false;
    }

    if (typeEspace && fields.type !== typeEspace) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesNom = fields.nom?.toLowerCase().includes(term);
      const matchesType = fields.type?.toLowerCase().includes(term);
      const matchesAdresse = fields.adresse?.toLowerCase().includes(term);
      const matchesArr = fields.arrondissement?.toLowerCase().includes(term);
      if (!matchesNom && !matchesType && !matchesAdresse && !matchesArr) return false;
    }

    return true;
  });

  const rows = filteredEspaces.map((item) => {
    const fields = item.fields || item;
    const isOpen = fields.ouvert_24h?.toString().toLowerCase() === "oui";
    return [
      fields.nom || "Non précisé",
      fields.type || fields.categorie || "Non précisé",
      fields.adresse || "Non précisé",
      fields.arrondissement || "Non précisé",
      fields.proportion_vegetation_haute ?? "Non précisé" + "%",
      isOpen ? "Oui" : "Non",
      fields.horaires_periode || "Non précisé",
    ];
  });

  return (
    <div className="container">
      <h1>Espaces verts à Paris</h1>

      <div className="search-bar">
        <label>Rechercher : </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher"
        />
      </div>

      <div className="controls-bar">
        <div className="left-controls">
          <ToggleButton view={viewState} setView={setViewState} />

          <div className="filters">
            <label>Arrondissement : </label>
            <select value={arrondissement} onChange={(e) => setArrondissement(e.target.value)}>
              <option value="">Tous</option>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={`750${(i + 1).toString().padStart(2, "0")}`}>
                  750{(i + 1).toString().padStart(2, "0")}
                </option>
              ))}
            </select>

            <label style={{ marginLeft: "20px" }}>Ouvert 24h : </label>
            <select value={ouvert24h} onChange={(e) => setOuvert24h(e.target.value)}>
              <option value="">Tous</option>
              <option value="oui">Oui</option>
              <option value="non">Non</option>
            </select>

            <label style={{ marginLeft: "20px" }}>Type : </label>
            <select value={typeEspace} onChange={(e) => setTypeEspace(e.target.value)}>
              <option value="">Tous</option>
              <option value="Promenades ouvertes">Promenades ouvertes</option>
              <option value="Bois">Bois</option>
              <option value="Jardinets décoratifs (Ephémères, partagés, pédagogiques)">
                Jardinets décoratifs
              </option>
              <option value="Jardins grandes institutions">Jardins grandes institutions</option>
              <option value="Décorations sur la voie publique">Décorations sur la voie publique</option>
              <option value="Jardins privatifs">Jardins privatifs</option>
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
        <MapView
          data={filteredEspaces.map((item) => {
            const fields = item.fields || item;
            return {
              title: fields.nom,
              description: fields.adresse || "Non précisée",
              geolocation: [fields.geo_point_2d?.lat || 0, fields.geo_point_2d?.lon || 0],
            };
          })}
        />
      )}

      {!loading && espaces.length > 0 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={page === 0}>Page précédente</button>
          <span>Page {page + 1}</span>
          <button onClick={nextPage}>Page suivante</button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Paris Fraicheur - Données provenant de la Mairie de Paris</p>
      </footer>
    </div>
  );
}

export default EspacesVerts;