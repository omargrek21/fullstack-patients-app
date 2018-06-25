import React from 'react';

const PatientItem = ({dni,titular_dni, full_name,birth_date,location,type,owner,branch,insurance_company}) => (
    <tr>
        <td>{dni}</td>
        <td>{titular_dni}</td>
        <td>{full_name}</td>
        <td>{birth_date}</td>
        <td>{location}</td>
        <td>{type}</td>
        <td>{owner}</td>
        <td>{branch}</td>
        <td>{insurance_company}</td>
    </tr>
);
    
export default PatientItem;