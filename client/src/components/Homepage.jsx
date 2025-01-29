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
    const navigate = useNavigate();

    useEffect(() => {
        checkAndClearExpiredData(); 

        if (!localStorage.user) {
            navigate('/login');
        }
    }, []);
  return (
   <>
        {/* <Navbar/> */}
        <Navbar onSelectAsset={setSelectedAsset} />
        <MapBox selectedAsset={selectedAsset} />
   </>
  )
}

export default Homepage