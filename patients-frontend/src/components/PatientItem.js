import React from 'react';
import '../containers/Data.css';

const PatientItem = ({color,dni,titular_dni, full_name,birth_date,location,type,owner,branch,insurance_company}) => (
    <tr className={color}>
        <td>{dni}</td>
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