const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000, // Interval for re-check lat lang
      maximumAge: 0, // For Stop Caching
    }
  );
}

// Leaflet
const map = L.map("map").setView([0, 0], 12);

const tileUrl = `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`; // openstreetmap tile url
// "https://{s}.tile.openstreetmap.org/${z}/${x}/${y}.png";
// s - sub domain
// z - zoom level
// x - x axis coordinate
// y - y axis coordinate

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Coded by coder\'s Abhisek Dubey';

const tiles = L.tileLayer(tileUrl, { attribution });

tiles.addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
