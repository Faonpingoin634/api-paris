import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// const item = {
//   identifiant: ""
//   title: "",
//   description: "",
//   adress: "",
//   geolocation: ["lat", "long"],
// };

const position = [48.86176186649498, 2.341194517819777];

export default function MapView({ data }) {
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height:600, width:"100%"}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((item) => (
        <Marker position={item.geolocation} key={item.identifiant}>
          <Popup>
            {item.title}
            <br />
            {item.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
