import React, {useState} from 'react';
// import './CustomCard.css';

const CustomCard = ({closeDrawer,isDrawerOpen, setIsDrawerOpen, selectedServiceInfo, setSelectedServiceInfo, reset, setIsVisible, openDrawer, name, status, services, icon }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const relode = () => {
    reset(1)
  }
  const toggleDrawer = () => {
    setIsDrawerOpen(true);
    setIsVisible((prev) => !prev);
  };
  const handleRowClick = (index, serviceName) => {
    if(window.innerWidth>768){
      setSelectedRow(index);
      setSelectedServiceInfo(serviceName);
      setIsDrawerOpen(true);
    }
  };
  return (
    <div className="card">
      <button style={{position:"absolute", border:"none", cursor:"pointer",top:"8px", left:"8px",fontSize:"1rem"}} onClick={relode}>↺ </button>
      <div className="header">
        <img style={(window.innerWidth<768 && name.startsWith('Submarine'))?{width:'80px'}:(name.startsWith('Submarine'))?{width:'120px'}:{}} src={icon}  onClick={()=>{setSelectedRow(null);setSelectedServiceInfo(null)}}/>
        <div className="header-content">
          <div></div>
          <h2 style={{cursor:"pointer"}} onClick={()=>{setSelectedRow(null);setSelectedServiceInfo(null)}} >{name}</h2>
          <button onClick={() => { toggleDrawer(); }} >More Details</button>
        </div>
      </div>
      <div className="status">
        <span>Status:</span> <span className={`state-${status.toLowerCase()}`}>{status}</span>
      </div>
      <table className='custom_card_table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Url</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={index}
              style={{
                backgroundColor: selectedRow === index ? '#E0E0E0' : 'transparent',
              }}
              onClick={() => handleRowClick(index, service.name)}>
              <td style={{cursor:'pointer'}} onClick={()=>{setSelectedServiceInfo(service.name);setIsDrawerOpen(true)}} >{service.name}</td>
              <td className={`state-${service.state.toLowerCase()}`}>{service.state}</td>
              <td>
                {service.url.startsWith('http') ? (
                  <a href={service.url} target="_blank" rel="noopener noreferrer">
                    {service.url}
                  </a>
                ) : (
                  service.url
                )}
              </td>
              <td>{service.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomCard;
