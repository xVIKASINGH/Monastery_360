"use client";
import { MapContainer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { GeoJsonObject } from "geojson";
import { useRouter } from "next/navigation";
import { Types } from "mongoose";
// Type for Monasteries
type Monastery = {
  _id : Types.ObjectId;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  foundedYear?: string;
  district?: string;
};

// Custom marker pin for monasteries
const monasteryIcon = new L.Icon({
  iconUrl: "/images/pin2.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function SikkimMap() {
  const [districts, setDistricts] = useState<GeoJsonObject | null>(null);
  const [monasteries, setMonasteries] = useState<Monastery[] | null>(null);
  const [hoverDistrict, setHoverDistrict] = useState<string>(""); // ⭐ hover text state
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null); // ⭐ modal state
  const router = useRouter();
  // Fetching geojson & monasteries list
  useEffect(() => {
    async function fetchData() {
      // fetch districts
      const districtsRes = await fetch("/Sikkim/SIKKIM_DISTRICTS.geojson");
      const districtsData: GeoJsonObject = await districtsRes.json();
      setDistricts(districtsData);

      // fetch monasteries from API
      const monasteriesRes = await fetch("/api/monastries");
      const monasteriesData = await monasteriesRes.json();
      const simplified = monasteriesData.map((m: any) => ({
        _id : m._id,
        name: m.name,
        lat: m.location.lat,
        lng: m.location.lng,
        description: m.description,
        foundedYear: m.foundedYear,
        district: m.district
      }));
      console.log(simplified);
      setMonasteries(simplified);
    }
    fetchData();
  }, []);

  // Boundary of Sikkim map
  const bounds: L.LatLngBoundsLiteral = [
    [27.0, 88.0],
    [28.2, 88.9],
  ];

  // STYLE default and hover
  const normalStyle = {
    color: "#fff",
    weight: 2,
    fillColor: "#DA4167",
    fillOpacity: 0.9,
  };

  const hoverStyle = {
    color: "#fff",
    weight: 3,
    fillColor: "#FFD369",
    fillOpacity: 1,
  };

  // DISTRICT EVENTS (hover + click zoom)
  const onEachDistrict = (feature: any, layer: any) => {
    layer.on({
      mouseover: () => {
        setHoverDistrict(feature.properties.DISTRICT); // ⭐ show district name
        layer.setStyle(hoverStyle);
      },
      mouseout: () => {
        setHoverDistrict("");
        layer.setStyle(normalStyle);
      },
      click: () => {
        const map = layer._map;
        map.fitBounds(layer.getBounds(), { padding: [40, 40] }); // ⭐ zoom district
      },
    });
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* ---- BACKGROUND BLURRED IMAGE ---- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/bg3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px) brightness(50%)",
          zIndex: 1,
        }}
      />

      {/* ---- PAGE TITLE ---- */}
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

      {/* ---- HOVER DISTRICT NAME ---- */}
      {hoverDistrict && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            width: "100%",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "600",
            color: "#FFD369",
            zIndex: 9,
            textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
            transition: "0.3s",
          }}
        >
          {hoverDistrict}
        </div>
      )}

      {/* ---- MAP ---- */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
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

          {/* ---- MONASTERY MARKERS ---- */}
          {monasteries &&
            monasteries.map((m, idx) => (
              <Marker
                key={idx}
                position={[m.lat, m.lng]}
                icon={monasteryIcon}
                eventHandlers={{
                  click: () => setSelectedMonastery(m), // ⭐ open modal
                }}
              >
                {/* <Popup>{m.name}</Popup> */}
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* ---- MODAL FOR MONASTERY DETAILS ---- */}
      {/* {selectedMonastery && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "15px 25px",
            borderRadius: "12px",
            width: "350px",
            textAlign: "center",
            zIndex: 20,
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
          }}
        >
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#DA4167" }}>
              {selectedMonastery.name}
            </h2>
            <p>district : {selectedMonastery.district}</p>
            <p>{selectedMonastery.foundedYear}</p>
            <p>{selectedMonastery.description}</p>
          </div>

          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "30px"
          }}>
            <button
              onClick={() => setSelectedMonastery(null)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                background: "white",
                color: "#DA4167",
                borderRadius: "6px",

              }}
            >
              View more
            </button>
            <button
              onClick={() => setSelectedMonastery(null)}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                background: "#DA4167",
                color: "white",
                borderRadius: "6px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )} */}
      {/* ---- MODAL FOR MONASTERY DETAILS ---- */}
      {selectedMonastery && (
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.95)",
            padding: "25px",
            borderRadius: "16px",
            width: "420px",
            zIndex: 30,
            backdropFilter: "blur(10px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            animation: "fadeUp 0.4s ease",
          }}
        >
          {/* Title + Info */}
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #DA4167, #FFD369)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "12px",
            }}
          >
            {selectedMonastery.name}
          </h2>

          <div style={{ marginBottom: "15px", color: "#444", fontSize: "15px" }}>
            <p><b>District:</b> {selectedMonastery.district}</p>
            <p><b>Founded:</b> {selectedMonastery.foundedYear}</p>
            <p style={{ marginTop: "8px", lineHeight: "1.4" }}>
              {selectedMonastery.description?.slice(0, 140)}...
            </p>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "10px",
            }}
          >
            <button
              style={{
                padding: "10px 18px",
                background: "#DA4167",
                color: "white",
                fontWeight: "600",
                borderRadius: "8px",
                cursor: "pointer",
                border: "none",
                boxShadow: "0 4px 10px rgba(218,65,103,0.4)",
                transition: "0.2s",
              }}
              onClick={() => router.push(`/monastery/${selectedMonastery._id}`) }
            >
              View More
            </button>

            <button
              onClick={() => setSelectedMonastery(null)}
              style={{
                padding: "10px 18px",
                background: "white",
                color: "#DA4167",
                fontWeight: "600",
                borderRadius: "8px",
                cursor: "pointer",
                border: "2px solid #DA4167",
                transition: "0.2s",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
