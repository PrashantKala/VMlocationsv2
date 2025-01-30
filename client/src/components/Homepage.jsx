import React, { useEffect,useState } from 'react'
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
        if (timeDifference > 60000) {
            localStorage.removeItem('user');
            console.log("Stored data expired and was removed from localStorage");
        }
    }
};



const Homepage = () => {
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
        <Navbar selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} openDrawer={openDrawer} closeDrawer={closeDrawer}  />
        <MapBox selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} openDrawer={openDrawer} closeDrawer={closeDrawer} />
        <div className={`drawer ${isDrawerOpen ? "open" : ""}`}>
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
      </div>

   </>
  )
}

export default Homepage