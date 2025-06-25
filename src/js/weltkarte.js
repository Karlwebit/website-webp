import L from "leaflet";

// Karte initialisieren
const map = L.map("map").setView([20, 0], 2); // Breite, Länge, Zoom

// TileLayer (OpenStreetMap) hinzufügen
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Beispiel-Marker
L.marker([51.0413, 13.7681])
  .addTo(map)
  .bindPopup("<strong>Dresden<strong>")
  .openPopup();
