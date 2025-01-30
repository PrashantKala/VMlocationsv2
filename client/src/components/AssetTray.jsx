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
            {assets[activeTab].map(({ category, items }) => (
              <div key={category} className="asset-category">
                <h3 className="category-title">{category}</h3>
                <div className="asset-items">
                  {items.map((asset) => (
                    <div className="asset-items-holder" key={asset.name}>
                      <div className={`asset-card ${asset.status}`}>
                        <div className={`status-dot ${asset.status === "active" ? "green" : "gray"}`}></div>
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
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>Log Out</button>

      {/* Drawer */}
      {/* <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        <button className="drawer-close" onClick={closeDrawer}>✖</button>
        {selectedAsset && (
          <div className="drawer-content">
            <h2>{selectedAsset.name}</h2>
            <img src={selectedAsset.icon} alt={selectedAsset.name} className="drawer-asset-icon" />
            <table>
              <tbody>
                {Object.entries(selectedAsset.properties).map(([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Navbar;