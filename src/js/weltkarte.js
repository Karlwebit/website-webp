// Importiert das Leaflet-CSS für die Kartenanzeige
import "leaflet/dist/leaflet.css";
// Importiert die Leaflet-Bibliothek
import L from "leaflet";

<<<<<<< HEAD
// Initialisiert die Karte
const map = L.map("map").setView([20, 0], 2);

// Fügt die OpenStreetMap-Kachel-Layer hinzu
=======
// Karte initialisieren
const map = L.map("map").setView([20, 0], 2); // Breite, Länge, Zoom

// TileLayer (OpenStreetMap) hinzufügen
>>>>>>> b72afb9ecb33356ed7020a201fa7a7bb30ab59f2
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Beispiel-Marker
L.marker([51.0413, 13.7681])
  .addTo(map)
  .bindPopup("<strong>Dresden<strong>")
  .openPopup();
