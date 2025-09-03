import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import IlotsDeFraicheur from "./IlotsDeFraicheur";
import EspacesVerts from "./EspacesVerts";
import Fontaines from "./Fontaines";
import GlassIcon from "./assets/icons8-verre-50.png";
import TreeIcon from "./assets/icons8-arbre-48.png";
import SpaceIcon from "./assets/icons8-immeuble-50.png";
import "leaflet/dist/leaflet.css";
import { fetchEspaceVerts, fetchFontaines } from "./service/api";
import MapView from "./components/map";

// Composant Carte avec points d'eau et parcs
function CartePoints() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // --- Fontaines ---
        const fontaines = (await fetchFontaines())
          .map((item) => {
            const fields = item.fields || item;
            return {
              identifiant: fields.gid,
              title: fields.type_objet,
              description: fields.voie || "Non précisée",
              geolocation: [fields.geo_point_2d?.lat, fields.geo_point_2d?.lon],
            };
          })
          .filter(Boolean);

        // --- Espaces verts / ilots de fraîcheur ---
        const espaces = (await fetchEspaceVerts())
          .map((item) => {
            const fields = item.fields || item;
            return {
              identifiant: fields.identifiant,
              title: fields.nom || "Espace vert",
              description: fields.type || "Non précisée",
              geolocation: [fields.geo_point_2d?.lat, fields.geo_point_2d?.lon],
            };
          })
          .filter(Boolean);

        setPoints([...fontaines, ...espaces]);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }

    fetchData();
  }, []);

  return <MapView data={points} />;
}

// App principal
function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route
          path="/"
          element={
            <div className="container">
              <header>
                <h1>Paris Fraicheur</h1>
              </header>
              <main>
                <h2>Notre But</h2>
                <p>
                  Ce site a pour objectif de guider les habitants et visiteurs
                  de Paris à la découverte des lieux où se rafraîchir pendant
                  les journées chaudes. Il référence les fontaines à eau
                  potable, les espaces ombragés et les points d’eau accessibles
                  gratuitement, permettant à chacun de se désaltérer et de
                  profiter d’activités en plein air sans souci. Que ce soit pour
                  une balade, un pique-nique ou un moment de détente, le site
                  facilite la localisation des endroits frais et agréables de la
                  capitale, tout en promouvant des solutions durables et
                  accessibles à tous.
                </p>
                <h2>Allez dans les différents espaces</h2>
                <div className="home-buttons">
                  <Link to="/ilots">
                    <button className="main-button Icon">
                      <img src={SpaceIcon} alt="Space" />
                      Voir les équipements et activités
                    </button>
                  </Link>
                  <Link to="/espaces-verts">
                    <button className="main-button Icon">
                      <img src={TreeIcon} alt="Tree" />
                      Voir les espaces verts
                    </button>
                  </Link>
                  <Link to="/fontaines">
                    <button className="main-button Icon">
                      <img src={GlassIcon} alt="glass" />
                      Voir les fontaines à boire
                    </button>
                  </Link>
                </div>
                <div>
                  <h2>Retrouver un point d'eau ou un parc</h2>
                  <CartePoints />
                </div>
              </main>

              {/* Footer */}
              <footer className="footer">
                <p>© 2025 Paris Fraicheur - Données provenant de la Mairie de Paris</p>
              </footer>
            </div>
          }
        />

        {/* Page des îlots */}
        <Route path="/ilots" element={<IlotsDeFraicheur />} />

        {/* Page des espaces verts */}
        <Route path="/espaces-verts" element={<EspacesVerts />} />

        {/* Page des fontaines */}
        <Route path="/fontaines" element={<Fontaines />} />
      </Routes>
    </Router>
  );
}

export default App;