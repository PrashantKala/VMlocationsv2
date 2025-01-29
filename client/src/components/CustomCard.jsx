import React from 'react';
// import './CustomCard.css';

const CustomCard = ({ name, status, services, icon }) => {
  return (
    <div className="card">
      <div className="header">
        <img src={icon}/>
        <h2>{name}</h2>
      </div>
      <div className="status">
        <span>Status:</span> <span className={`state-${status.toLowerCase()}`}>{status}</span>
      </div>
      <table>
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
