"use client";
import { MapContainer, GeoJSON , Marker, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { GeoJsonObject } from "geojson";
type Monastery = {
  name: string;
  lat: number;
  lng: number;
};

// Create a custom icon (optional) for monastery pins
const monasteryIcon = new L.Icon({
  iconUrl: "/images/pin.png",  // tum apna koi pin icon url yahan de sakte ho
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function SikkimMap() {
  const [districts, setDistricts] = useState<GeoJsonObject | null>(null);
    const [monasteries, setMonasteries] = useState<Monastery[] | null>(null);
  useEffect(() => {
    async function fetchData() {
      // Fetch districts geojson
      const districtsRes = await fetch("/Sikkim/SIKKIM_DISTRICTS.geojson");
      const districtsData: GeoJsonObject = await districtsRes.json();
      setDistricts(districtsData);
      // Fetch monasteries with name and location
      const monasteriesRes = await fetch("/api/monastries");
      const monasteriesData = await monasteriesRes.json();
    const simplifiedMonasteries = monasteriesData.map((monastery: any) => ({
      name: monastery.name,
      lat: monastery.location.lat,
      lng: monastery.location.lng,
    }));
    setMonasteries(simplifiedMonasteries)
      console.log(simplifiedMonasteries);
    }
    fetchData();
  }, []);

  const bounds: L.LatLngBoundsLiteral = [
    [27.0, 88.0],
    [28.2, 88.9],
  ];
  const normalStyle = {
    color: "#fff",
    weight: 2,
    fillColor: "#DA4167",
    fillOpacity: 0.9,
  };

  // Hover style
  const hoverStyle = {
    color: "#fff",
    weight: 3,
    fillColor: "#d8ca7cff",
    fillOpacity: 1,
  };

  const onEachDistrict = (feature: any, layer: any) => {
    layer.on({
      mouseover: () => {
        layer.setStyle(hoverStyle);
      },
      mouseout: () => {
        layer.setStyle(normalStyle);
      },
    });
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* BLURRED BG IMAGE ONLY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/bg3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px) brightness(50%)", // HEAVY BLUR
          zIndex: 1,
        }}
      />
        <h1
    style={{
      position: "absolute",
      top: "30px",
      width: "100%",
      textAlign: "center",
      fontSize: "48px",
      fontWeight: "bold",
      color: "white",
      zIndex: 3,
      letterSpacing: "2px",
      textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
    }}
  >
   Sikkim — Journey Through Monasteries
  </h1>
      {/* MAP ABOVE BG */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
        }}
      >
        <MapContainer
          center={[27.533, 88.512]}
          zoom={9}
          minZoom={8}
          maxBounds={bounds}
          zoomControl={false}
          dragging={true}
          style={{ height: "100%", width: "100%", background: "transparent" }}
        >
          {districts && (
            <GeoJSON data={districts} style={normalStyle} onEachFeature={onEachDistrict} />
          )}
          {monasteries &&
            monasteries.map(({ name, lat, lng }, idx) => (
              <Marker
                key={idx}
                position={[lat, lng]}
                icon={monasteryIcon}
                
              >
                <Popup>{name}</Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
