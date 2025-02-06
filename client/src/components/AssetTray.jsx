import React, { useState } from "react";
import asset from "../assets.json";
import logo from "/images/logo.png"
import mobile_logo from "/images/480_logo.png"
import _ from 'lodash';
const Navbar = ({isCustomCard,setWhoIsActive, activeTab, closeTab, closing, tabs,setinfoSelectedAsset,onSelectAsset, openDrawer,closeDrawer }) => {

  const [hoveredAsset, setHoveredAsset] = useState(null);



  const assets = asset;


  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const selectAsset = (asset) => {
    // openDrawer();
    closeDrawer()
    onSelectAsset(asset);
  };

  const statusColors = {
    poweringon: "black",
    poweredoff: "grey",
    unmanaged: "yellow",
    ready: "green",
    error: "red",
  };

  const infoClicked=(asset)=>{
    console.log("clicked");
    onSelectAsset(null);
    setinfoSelectedAsset(asset);
    openDrawer();
    console.log("clicked");
  }


  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={window.innerWidth>768?logo:mobile_logo} alt="Company Logo" className="logo-img" />
      </div>

      <div className="asset-tray">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              // onClick={() => {setActiveTab(activeTab === tab ? null : tab)}}
              onClick={() => {closeTab(tab);if(!isCustomCard){setWhoIsActive(activeTab === tab ? null : tab)}}}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab && (
          <div className={`asset-container ${activeTab ? "open" : ""} ${closing ? "closing" : ""}`}>

            {window.innerWidth>768?<button className="close-button" onClick={() => { closeTab()}}>^</button>:""}
            <div className="category-container">
            {assets[activeTab].map(({ category, items }) => (
              <div key={category} className="asset-category">
                <h3 className="category-title">{category}</h3>
                <div className="asset-items">
                  {items.map((asset) => (
                    <div className="asset-items-holder" key={asset.name}>
                      <div className={`asset-card ${asset.status}`}>
                      <div className={`status-dot ${statusColors[asset.status]}`}></div>
                        {/* <div className="info-button" onClick={()=>window.innerWidth<=768?infoClicked(asset):setinfoSelectedAsset(null)} onMouseEnter={() => window.innerWidth>768? setHoveredAsset(asset):setHoveredAsset(null)} onMouseLeave={() => setHoveredAsset(null)}>ℹ</div>
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
                        )} */}
                        <img onClick={() => selectAsset(asset)} src={asset.icon} alt={asset.name} className="asset-icon" />
                        {/* <button className="plus-button" onClick={() => selectAsset(asset)}> <img src="/images/gps.png"/> </button> */}
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

      <button  className={`logout-button`} onClick={handleLogout}>Log Out</button>

    </div>
  );
};

export default Navbar;