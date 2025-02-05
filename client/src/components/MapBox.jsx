import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import assets from '../assets.json';
import CustomCard from './CustomCard';
import { createRoot } from 'react-dom/client';



function MapBox({ setIsVisible,closeTab, onSelectAsset,selectedAsset, openDrawer,closeDrawer }) {
  const mapRef = useRef(null);
  const markersRef = useRef({});


  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([39.8283, -98.5795], 4);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const addMarkers = (assets) => {
        // console.log(data)
        for(const key in assets){
          const data=assets[key]
          for (const category of data) {
            for (const item of category.items) {
              if (item.longitude && item.latitude) {
                const popupContent = document.createElement('div');
                popupContent.classList.add('popup-container'); // Add a class
                // popupContent.style.width = '400px'; // Set an appropriate width for your content
                popupContent.style.minHeight = '100px'; // Set a minimum height if needed
                popupContent.style.overflow = 'visible'; // Allow content to expand
                popupContent.innerHTML = `<div id="popup-${item.name.replace(/\s+/g, '-')}" ></div>`;
  
                const statusColors = {
                  poweringon: "black",
                  poweredoff: "grey",
                  unmanaged: "yellow",
                  ready: "green",
                  error: "red",
                };
                
                const marker = L.marker([item.latitude, item.longitude], {
                  icon: L.divIcon({
                    html: `<div style="
                      position: relative;
                      background: white; 
                      border-radius: 50%; 
                      width: 50px; 
                      height: 50px; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      z-index: 10000;
                    ">
                      <img src="${item.icon}" style="z-index: 10000; width: 40px; height: 40px; border-radius: 50%;" />
                      <div style="
                        position: absolute;
                        top: -3px;
                        left: -3px;
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        background-color: ${statusColors[item.status] || 'grey'};
                        border: 2px solid white;
                      "></div>
                    </div>
                    <div style="
                      z-index: 100; 
                      position: fixed; 
                      bottom: -25px; 
                      left: 70%; 
                      border-radius: 0% 0% 50% 50%;  
                      display: flex; 
                      width: 5px; 
                      height: 20px; 
                      background-color: white;
                    "></div>`,
                    className: "",
                    iconSize: [30, 30],
                  }),
                }).addTo(map);
                
  
                marker.bindPopup(popupContent);
                markersRef.current[item.name] = marker;
  
                marker.on("click", () => {
                  // openDrawer();
                  // console.log(data)
                  

                });
  
                marker.on('popupopen', () => {
                  const rootElement = document.getElementById(`popup-${item.name.replace(/\s+/g, '-')}`);
                  if (rootElement) {
                    const root = createRoot(rootElement);
                    root.render(<CustomCard setIsVisible={setIsVisible} openDrawer={openDrawer}  name={item.name} status={item.status} services={item.services} icon={item.icon} />);
                    marker.reactRoot = root;
                  }
                  onSelectAsset(item)
                  closeTab(key)
                  // if(activeTab!=key){
                  // }
                  // activeTab!=key?closeTab(key)
                });
  
                marker.on('popupclose', () => {
                  if (marker.reactRoot) {
                    marker.reactRoot.unmount();
                  }
                  // closeTab(key)
                  // setActiveTab(null)
                });
              }
            }
          }
        }
      };

      addMarkers(assets);
      // addMarkers(assets['On-Prem']);
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
        closeDrawer();
        mapRef.current.flyTo([39.8283, -98.5795], 4, { animate: true, duration: 2 }); 
        mapRef.current.flyTo([selectedAsset.latitude, selectedAsset.longitude], 13, { animate: true, duration: 2 });
        setTimeout(() => {
          marker.openPopup();
          window.innerWidth>768?mapRef.current.panBy([0, -210]):mapRef.current.panBy([0, -50]); // Adjust to ensure popup is fully visible
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
