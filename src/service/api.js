const baseURL = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets";
const limit = 20;

export const fetchEspaceVerts = (pageNum) => {
  const url =
    `${baseURL}/ilots-de-fraicheur-espaces-verts-frais/records` +
    (pageNum !== undefined ? `?limit=${limit}&offset=${pageNum * limit}` : "");

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.results || [])
    .catch((err) => {
      console.error("Erreur API :", err);
    });
};

export const fetchFontaines = (pageNum) => {
  const url =
    `${baseURL}/fontaines-a-boire/records` +
    (pageNum !== undefined ? `?limit=${limit}&offset=${pageNum * limit}` : "");

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.results || [])
    .catch((err) => {
      console.error("Erreur API :", err);
    });
};

export const fetchActivité = (pageNum) => {
  const url =
    `${baseURL}/ilots-de-fraicheur-equipements-activites/records` +
    (pageNum !== undefined ? `?limit=${limit}&offset=${pageNum * limit}` : "");

  return fetch(url)
    .then((res) => res.json())
    .then((data) => data.results || [])
    .catch((err) => {
      console.error("Erreur API :", err);
    });
};