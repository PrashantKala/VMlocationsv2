import React from 'react';
// import './CustomCard.css';

const CustomCard = ({ reset, setIsVisible, openDrawer, name, status, services, icon }) => {
  const relode = () => {
    reset(1)
  }
  return (
    <div className="card">
      <button style={{position:"absolute", border:"none", cursor:"pointer",top:"8px", left:"8px",fontSize:"1rem"}} onClick={relode}>↺ </button>
      <div className="header">
        <img src={icon} />
        <div className="header-content">
          <div></div>
          <h2 >{name}</h2>
          <button onClick={() => { openDrawer(); setIsVisible(true); }} >More Details</button>
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
            <tr key={index}>
              <td>{service.name}</td>
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
