import React, { useEffect, useState } from 'react'
import Navbar from './AssetTray';
import MapBox from './MapBox';
// import Navbar from './Navabar';
import { useNavigate } from 'react-router-dom';

const checkAndClearExpiredData = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - parsedUser.timestamp;

    // Check if 1 minute (60000 ms) has passed
    if (timeDifference > 600000) {
      localStorage.removeItem('user');
      console.log("Stored data expired and was removed from localStorage");
    }
  }
};



const Homepage = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleDisplay = () => {
    setIsVisible((prev) => !prev);
  };
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [infoSelectedAsset, setinfoSelectedAsset] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const tabs = ["In-Cloud", "On-Prem"];
  const closeTab = (tab) => {
    setClosing(true);
    setTimeout(() => {
      setActiveTab(activeTab === tab ? null : tab);
      setClosing(false);
    }, 100); // Wait for animation to finish
  };
  const navigate = useNavigate();

  useEffect(() => {
    checkAndClearExpiredData();

    if (!localStorage.user) {
      navigate('/login');
    }
  }, []);

  const openDrawer = (asset) => {
    // setSelectedAsset(asset);
    setIsDrawerOpen(true);
    // onSelectAsset(asset);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // setSelectedAsset(null);
  };
  return (
    <>
      {/* <Navbar/> */}
      <Navbar closing={closing} activeTab={activeTab} closeTab={closeTab} tabs={tabs} setinfoSelectedAsset={setinfoSelectedAsset} selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} openDrawer={openDrawer} closeDrawer={closeDrawer} />
      <MapBox setIsVisible={setIsVisible} setActiveTab={setActiveTab} closeTab={closeTab} selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} openDrawer={openDrawer} closeDrawer={closeDrawer} />
      {(window.innerWidth > 768) || (window.innerWidth < 768 && selectedAsset != null) ? <div style={window.innerWidth > 768 ? {} : {
        display: isVisible ? "flex" : "none",
      }} className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        {isDrawerOpen ? <button className="drawer-close" onClick={()=>window.innerWidth>768? closeDrawer():toggleDisplay()}>{window.innerWidth > 768 ? ">" : "v"}</button> : <button className="drawer-open" onClick={openDrawer}>{window.innerWidth > 768 ? "<" : "^"}</button>}
        {selectedAsset != null ? (
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
        ) : <h3 style={{ fontSize: "1.5rem", marginTop: "60%" }}>Please select an asset</h3>}
      </div> : <div style={{ display: 'none' }}></div>}

    </>
  )
}

export default Homepage