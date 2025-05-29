import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

export default function MapaWebView({ latitude, longitude }: { latitude: number, longitude: number }) {
  console.log("Mapa renderizado con:", latitude, longitude);
  const generateMapHTML = (lat: number, lon: number) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: white;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${lat}, ${lon}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          var marker = L.marker([${lat}, ${lon}]).addTo(map);
          marker.bindPopup("¡Tu Neartag está aquí!").openPopup();
        </script>
      </body>
    </html>`;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: generateMapHTML(latitude, longitude) }}
      style={StyleSheet.absoluteFillObject}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      mixedContentMode="always"
    />
  );
}
