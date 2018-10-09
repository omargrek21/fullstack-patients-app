import React from 'react';
import '../Data.css';

const PatientGps = ({color,dni,address,full_name,birth_date,device_phone,patient_phone,contact_name_1,contact_name_2,contact_name_3,contact_phone_1,contact_phone_2,contact_phone_3,relationship_1,relationship_2,relationship_3}) => (
    <tr className={color}>
        <td>{full_name}</td>
        <td>{dni}</td>
        <td>{address}</td>
        <td>{birth_date}</td>
        <td>{device_phone}</td>
        <td>{patient_phone}</td>
        {contact_name_1 ? (
           <td> {contact_name_1} ({relationship_1}): {contact_phone_1}</td>
        ) : (
            <td>N/A</td>
        )}
        {contact_name_2 ? (
           <td> {contact_name_2} ({relationship_2}): {contact_phone_2}</td>
        ) : (
            <td>N/A</td>
        )}
        {contact_name_3 ? (
           <td> {contact_name_3} ({relationship_3}): {contact_phone_3}</td>
        ) : (
            <td>N/A</td>
        )}
    </tr>
);
    
export default PatientGps;