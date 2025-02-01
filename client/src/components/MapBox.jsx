import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import assets from '../assets.json';
import CustomCard from './CustomCard';
import { createRoot } from 'react-dom/client';
function MapBox({ selectedAsset, openDrawer }) {
  const mapRef = useRef(null);
  const markersRef = useRef({});


  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([39.8283, -98.5795], 4);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      const addMarkers = (data) => {
        for (const category of data) {
          for (const item of category.items) {
            if (item.longitude && item.latitude) {
              const popupContent = document.createElement('div');
              popupContent.classList.add('popup-container'); // Add a class
              // popupContent.style.width = '400px'; // Set an appropriate width for your content
              popupContent.style.minHeight = '100px'; // Set a minimum height if needed
              popupContent.style.overflow = 'visible'; // Allow content to expand
              popupContent.innerHTML = `<div id="popup-${item.name.replace(/\s+/g, '-')}" ></div>`;

              const marker = L.marker([item.latitude, item.longitude], {
                icon: L.icon({
                  iconUrl: item.icon,
                  iconSize: [25, 25],
                }),
              }).addTo(map);

              marker.bindPopup(popupContent);
              markersRef.current[item.name] = marker;

              marker.on("click", () => {
                openDrawer();
              });

              marker.on('popupopen', () => {
                const rootElement = document.getElementById(`popup-${item.name.replace(/\s+/g, '-')}`);
                if (rootElement) {
                  const root = createRoot(rootElement);
                  root.render(<CustomCard name={item.name} status={item.status} services={item.services} icon={item.icon} />);
                  marker.reactRoot = root;
                }
              });

              marker.on('popupclose', () => {
                if (marker.reactRoot) {
                  marker.reactRoot.unmount();
                }
              });
            }
          }
        }
      };

      addMarkers(assets['In-Cloud']);
      addMarkers(assets['On-Prem']);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedAsset && mapRef.current) {
      const marker = markersRef.current[selectedAsset.name];
      if (marker) {
        mapRef.current.flyTo([39.8283, -98.5795], 4, { animate: true, duration: 3 }); 
        mapRef.current.flyTo([selectedAsset.latitude, selectedAsset.longitude], 10, { animate: true, duration: 3 });
        setTimeout(() => {
          marker.openPopup();
          mapRef.current.panBy([0, -210]); // Adjust to ensure popup is fully visible
        }, 3000);
      }
    }
  }, [selectedAsset]);

  return (
    <div className="app-container">
      <div id="map" className="map-container" ></div>
    </div>
  );
}

export default MapBox;
