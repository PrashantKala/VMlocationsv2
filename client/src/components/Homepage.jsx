import React, { useEffect, useState, useRef } from 'react'
import Navbar from './AssetTray';
import MapBox from './MapBox';
import Drawer from './Drawer';
import axios from 'axios';

// import Navbar from './Navabar';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  const count=useRef(0);
  const [isCustomCard, setIsCustomCard] = useState(false);
  const [whoIsActive, setWhoIsActive] = useState(null)
  const [isVisible, setIsVisible] = useState(false);
  const [seed, setSeed] = useState(1);
  const [resetCall, setResetCall] = useState(0);
  const [selectedServiceInfo, setSelectedServiceInfo] = useState(null)
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [infoSelectedAsset, setinfoSelectedAsset] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const tabs = ["In-Cloud", "On-Prem"];
  const [assets, setAssets] = useState({});
  const [isAssetChanged, setAssetChange] = useState(null);
    const fetchData = () => {
      axios.get("../assets.json")
        .then(response => {
          console.log("Fetching",assets)  
          const newChange = response.data.change;
          if (newChange !== isAssetChanged) {
            setAssets(response.data.asset);
            setAssetChange(newChange);
            if(count.current===0){
              count.current=1
            }else{
              reset(1)
            }
          }
        })
        .catch(error => {
          console.error('Error fetching assets data:', error);
        });
    };
    useEffect(() => {
      fetchData();
      
      
      const intervalId = setInterval(fetchData, 500);
  
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, [isAssetChanged]);
  const closeTab = (tab) => {
    setClosing(true);
    setTimeout(() => {
      if (activeTab === tab) {
        setActiveTab(null)
        setSelectedAsset(null);
      } else {
        setActiveTab(tab)
      }
      setClosing(false);
    }, 100);
  };
  const reset = (val) => {
    // console.log(asset)
    setResetCall(val);
    setActiveTab(null);
    setSeed(Math.random());
  }

  const toggleDisplay = () => {
    setIsVisible((prev) => !prev);
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
    setIsVisible(true)
    setIsDrawerOpen(true);
    // onSelectAsset(asset);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsVisible(null)
    // setSelectedAsset(null);
  };
  return (
    <>
      {/* <Navbar/> */}
      <Navbar assets={assets} isCustomCard={isCustomCard} whoIsActive={whoIsActive} setWhoIsActive={setWhoIsActive} closing={closing} activeTab={activeTab} closeTab={closeTab} tabs={tabs} setinfoSelectedAsset={setinfoSelectedAsset} selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} openDrawer={openDrawer} closeDrawer={closeDrawer} />


      <MapBox assets={assets} setIsDrawerOpen={setIsDrawerOpen} isVisible={isVisible} isDrawerOpen={isDrawerOpen} selectedServiceInfo={selectedServiceInfo} setSelectedServiceInfo={setSelectedServiceInfo} setIsCustomCard={setIsCustomCard} isCustomCard={isCustomCard} setWhoIsActive={setWhoIsActive} whoIsActive={whoIsActive} resetCall={resetCall} setResetCall={setResetCall} reset={reset} key={seed} setIsVisible={setIsVisible} activeTab={activeTab} setActiveTab={setActiveTab} closeTab={closeTab} selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} openDrawer={openDrawer} closeDrawer={closeDrawer} />


      {(window.innerWidth > 768) || (window.innerWidth < 768 && selectedAsset != null) ? <div style={window.innerWidth > 768 ? {} : {
        display: isVisible ? "flex" : "none",
      }} className={`drawer ${isDrawerOpen ? "open" : ""}`}>
        {isVisible ? <button className="drawer-close" onClick={() => window.innerWidth > 768 ? closeDrawer() : toggleDisplay()}>{window.innerWidth > 768 ? ">" : "v"}</button> : <button className="drawer-open" onClick={openDrawer}>{window.innerWidth > 768 ? "<" : "^"}</button>}
        {selectedAsset != null ? (



          <Drawer key={seed} selectedServiceInfo={selectedServiceInfo} selectedAsset={selectedAsset} />

        ) : <h3 style={{ fontSize: "1.5rem", marginTop: "60%" }}>Please select an asset</h3>}
      </div> : <div style={{ display: 'none' }}></div>}

    </>
  )
}

export default Homepage

