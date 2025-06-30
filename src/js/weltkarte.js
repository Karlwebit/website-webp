// Importiert das Leaflet-CSS für die Kartenanzeige
import "leaflet/dist/leaflet.css";
// Importiert die Leaflet-Bibliothek
import L from "leaflet";

// Initialisiert die Karte
const map = L.map("map").setView([20, 0], 2);

// Fügt die OpenStreetMap-Kachel-Layer hinzu
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);
