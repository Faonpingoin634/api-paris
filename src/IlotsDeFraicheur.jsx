import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "./components/Table";
import MapView from "./components/map";
import ToggleButton from "./components/ToggleButton";
import "./App.css";
import { fetchActivité } from "./service/api";

const columns = [
  "Nom",
  "Type",
  "Adresse",
  "Arrondissement",
  "Payant",
  "Horaires",
  "Coordonnées",
];

function IlotsDeFraicheur() {
  const [lieux, setLieux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [arrondissement, setArrondissement] = useState("");
  const [typeLieu, setTypeLieu] = useState("");
  const [payant, setPayant] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewState, setViewState] = useState("list"); // "list" | "map"
  const navigate = useNavigate();

  const fetchData = (pageNum) => {
    setLoading(true);
    fetchActivité(pageNum).then((data) => {
      setLieux(data);
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

  const filteredLieux = lieux.filter((item) => {
    const fields = item.fields || item;
    if (arrondissement && fields.arrondissement !== arrondissement) return false;
    if (typeLieu && fields.type !== typeLieu) return false;
    if (payant && fields.payant !== payant) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches =
        fields.nom?.toLowerCase().includes(term) ||
        fields.type?.toLowerCase().includes(term) ||
        fields.adresse?.toLowerCase().includes(term) ||
        fields.arrondissement?.toLowerCase().includes(term);
      if (!matches) return false;
    }
    return true;
  });

  const rows = filteredLieux.map((item) => {
    const fields = item.fields || item;
    return [
      fields.nom || "Non précisé",
      fields.type || "Non précisé",
      fields.adresse || "Non précisé",
      fields.arrondissement || "Non précisé",
      fields.payant || "Non précisé",
      fields.horaires_periode || "Non précisé",
      `${fields.geo_point_2d?.lat || "-"}, ${fields.geo_point_2d?.lon || "-"}`,
    ];
  });

  return (
    <div className="container">
      <h1>Voir les équipements et activités</h1>

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

            <label style={{ marginLeft: "20px" }}>Type de lieu : </label>
            <select value={typeLieu} onChange={(e) => setTypeLieu(e.target.value)}>
              <option value="">Tous</option>
              <option value="Lieux de culte">Lieux de culte</option>
              <option value="Ombrière pérenne">Ombrière pérenne</option>
              <option value="Musée">Musée</option>
              <option value="Mairie d'arrondissement">Mairie d'arrondissement</option>
              <option value="Bains-douches">Bains-douches</option>
              <option value="Bibliothèque">Bibliothèque</option>
              <option value="Brumisateur">Brumisateur</option>
              <option value="Baignade extérieure">Baignade extérieure</option>
              <option value="Piscine">Piscine</option>
              <option value="Terrain de boules">Terrain de boules</option>
              <option value="Découverte et Initiation">Découverte et Initiation</option>
            </select>

            <label style={{ marginLeft: "20px" }}>Payant : </label>
            <select value={payant} onChange={(e) => setPayant(e.target.value)}>
              <option value="">Tous</option>
              <option value="Oui">Oui</option>
              <option value="Non">Non</option>
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
          data={filteredLieux.map((item) => {
            const fields = item.fields || item;
            return {
              title: fields.nom,
              description: fields.adresse || "Non précisé",
              geolocation: [fields.geo_point_2d?.lat || 0, fields.geo_point_2d?.lon || 0],
            };
          })}
        />
      )}

      {!loading && lieux.length > 0 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={page === 0}>
            Page précédente
          </button>
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

export default IlotsDeFraicheur;
