import React, { Component } from 'react';
import { connect } from "react-redux";
import PatientItem from '../components/PatientItem';
import '../Data.css';
import { Link } from "react-router-dom";

class Data extends Component {  
  constructor(props) {
    super(props);
  }
    render() {
      const patients = this.props.patients.map((patient,index) => (
        <PatientItem
          color = {index % 2 ===0 ? 'even' : 'odd'}
          key = {patient._id}
          {...patient}
        />
      ));  
     
      return(
        <div className="data">  
          {this.props.currentUser.user.email === 'operez@grupov.com.ve' && (<Link to='/upload'> Upload new Data </Link>)}
          <table className="dataTable">
            <thead className="tableHead">
              <tr>
                <th>Beneficiario</th>
                <th>Titular</th>
                <th>Nombre Completo</th>
                <th>Fecha Nac.</th>
                <th>Ubicación</th>
                <th>Tipo</th>
                <th>Contratante</th>
                <th>Ramo</th>
                <th>Seguro</th>
              </tr>
            </thead>
              <tbody>
                {patients}
              </tbody>
          </table>
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    patients: state.patients,
    currentUser: state.currentUser
  };
}

export default connect(mapStateToProps, null)(
  Data
);
