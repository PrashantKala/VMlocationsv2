import React, { useState } from "react";
import asset from "../assets.json";

const Navbar = ({ onSelectAsset, openDrawer }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [hoveredAsset, setHoveredAsset] = useState(null);

  const tabs = ["In-Cloud", "On-Prem"];
  const assets = asset;

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const selectAsset = (asset) => {
    openDrawer();
    onSelectAsset(asset);
  };

  const statusColors = {
    poweringon: "black",
    poweredoff: "grey",
    unmanaged: "yellow",
    ready: "green",
    error: "red",
  };


  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src="public/images/logo.png" alt="Company Logo" className="logo-img" />
      </div>

      <div className="asset-tray">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(activeTab === tab ? null : tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab && (
          <div className="asset-container">
            <button className="close-button" onClick={() => setActiveTab(null)}>✖</button>
            <div className="category-container">
            {assets[activeTab].map(({ category, items }) => (
              <div key={category} className="asset-category">
                <h3 className="category-title">{category}</h3>
                <div className="asset-items">
                  {items.map((asset) => (
                    <div className="asset-items-holder" key={asset.name}>
                      <div className={`asset-card ${asset.status}`}>
                      <div className={`status-dot ${statusColors[asset.status]}`}></div>
                      {console.log(asset.status)}
                        <div className="info-button" onMouseEnter={() => setHoveredAsset(asset)} onMouseLeave={() => setHoveredAsset(null)}>ℹ</div>
                        {hoveredAsset === asset && (
                          <div className="tooltip-card" onMouseEnter={() => setHoveredAsset(asset)} onMouseLeave={() => setHoveredAsset(null)}>
                            <h4>{asset.name}</h4>
                            <table>
                              <tbody>
                                {Object.entries(asset.properties).map(([key, value]) => (
                                  <tr key={key}>
                                    <th>{key}</th>
                                    <td>{value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        <img src={asset.icon} alt={asset.name} className="asset-icon" />
                        <button className="plus-button" onClick={() => selectAsset(asset)}> <img src="/images/gps.png"/> </button>
                      </div>
                      <div className="asset-name">{asset.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>Log Out</button>

    </div>
  );
};

export default Navbar;