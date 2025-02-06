import React, { useEffect, memo ,useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import assets from '../assets.json';
import CustomCard from './CustomCard';
import { createRoot } from 'react-dom/client';
import { debounce } from 'lodash';


const MapBox = memo(({ setIsCustomCard, isCustomCard, setWhoIsActive, whoIsActive, setResetCall, resetCall, reset, setIsVisible, closeTab, onSelectAsset, selectedAsset, openDrawer, closeDrawer }) => {
  const debouncedSetWhoIsActive = debounce(setWhoIsActive, 300);
  const debouncedSetIsCustomCard = debounce(setIsCustomCard, 300);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  const initializeMap = () => {
    if (!mapRef.current) {
      const map = L.map('map').setView([39.8283, -98.5795], 4);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
    }
  };

  const createMarker = (item, map, key) => {
    if (!item.longitude || !item.latitude) return;

    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-container');
    popupContent.innerHTML = `<div id="popup-${item.name.replace(/\s+/g, '-')}" ></div>`;

    const statusColors = {
      poweringon: 'black',
      poweredoff: 'grey',
      unmanaged: 'yellow',
      ready: 'green',
      error: 'red',
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
                  z-index: 10000;">
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
              </div>`
      }),
    }).addTo(map);

    marker.bindPopup(popupContent);
    markersRef.current[item.name] = marker;

    marker.on('popupopen', () => handlePopupOpen(item, key, marker));
    marker.on('popupclose', () => handlePopupClose(marker));
  };

  const addMarkers = (whoIsActive, assets, map) => {
    if (whoIsActive === null) {
      // console.log("i am triggerd-1")
      for (const key in assets) {
        assets[key].forEach(category => {
          category.items.forEach(item => createMarker(item, map, key));
        });
      }
    }
    else {
      // console.log("i am triggerd-2")

      assets[whoIsActive].forEach(category => {
        // console.log(category)
        category.items.forEach(item => createMarker(item, map, whoIsActive));
      });
    }
  };
  const handlePopupOpen = (item, key, marker) => {
    if (marker.popupIsOpen) return;
    marker.popupIsOpen = true;
  
    const rootElement = document.getElementById(`popup-${item.name.replace(/\s+/g, '-')}`);
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(
        <CustomCard
          reset={reset}
          setIsVisible={setIsVisible}
          openDrawer={openDrawer}
          name={item.name}
          status={item.status}
          services={item.services}
          icon={item.icon}
        />
      );
      marker.reactRoot = root;
    }
  
    onSelectAsset(item);
  
    // Open the tab only if it's not already active
    if (whoIsActive !== key) {
      debouncedSetWhoIsActive(key);
    }
    closeTab(key);
  
    // Set isCustomCard to true only if it's currently false to avoid duplicate animation
    if (!isCustomCard) {
      debouncedSetIsCustomCard(true);
    }
  };
  
  const handlePopupClose = (marker) => {
    if (marker.reactRoot) {
      marker.reactRoot.unmount();
    }
  
    // Set isCustomCard to false only if it's currently true
    if (isCustomCard) {
      setIsCustomCard(false);
    }
  };
  

  useEffect(() => {
    initializeMap();
    // console.log(assets)
    // console.log(whoIsActive)
    addMarkers(whoIsActive, assets, mapRef.current)
    // if(whoIsActive!==null){
    // Object.key()
    // }
    // whoIsActive===null?addMarkers(assets, mapRef.current):addMarkers(assets[whoIsActive], mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [whoIsActive]);

  useEffect(() => {
    if (selectedAsset && mapRef.current) {
      const marker = markersRef.current[selectedAsset.name];
      if (marker && resetCall) {
        closeDrawer();
        mapRef.current.setView([selectedAsset.latitude, selectedAsset.longitude], 13);
        marker.openPopup();
        setTimeout(() => {
          mapRef.current.panBy([0, window.innerWidth > 768 ? -210 : -50]);
        }, 500);
        setResetCall(0);
      } else if (marker) {
        closeDrawer();
        mapRef.current.flyTo([39.8283, -98.5795], 4, { animate: true, duration: 2 });
        mapRef.current.flyTo([selectedAsset.latitude, selectedAsset.longitude], 13, { animate: true, duration: 1 });
        setTimeout(() => {
          marker.openPopup();
          mapRef.current.panBy([0, window.innerWidth > 768 ? -210 : -50]);
        }, 1000);
      }
    }
  }, [selectedAsset]);

  return <div className="app-container"><div id="map" className="map-container" /></div>;
});

export default MapBox;
