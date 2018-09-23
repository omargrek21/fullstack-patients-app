import React, { Component } from 'react';
import { connect } from "react-redux";
import PatientItem from '../components/PatientItem';
import '../Data.css';
import { Link } from "react-router-dom";

class Data extends Component {  
      render() {
      const patients = this.props.patients.map((patient,index) => (
        <PatientItem
          color = {index % 2 ===0 ? 'even' : 'odd'}
          key = {patient._id}
          {...patient}
        />
      ));  
      
      const beneficiaries = this.props.beneficiaries.map((patient,index) => (
        <PatientItem
          color = {index % 2 ===0 ? 'even' : 'odd'}
          key = {patient._id}
          {...patient}
        />
      ));
     
      return(
        <div className="data">  
          {this.props.currentUser.user.email === 'operez@grupov.com.ves' && (<Link to='/upload'> Upload new Data </Link>)}
          <h3> Póliza(s) del usuario: {this.props.messages.patients} </h3>
          <table className="dataTable">
            <thead className="tableHead">
              <tr>
                <th>Cédula</th>
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
          <h3> Beneficiarios: {this.props.messages.beneficiaries} </h3>
          <table className="dataTable">
            <thead className="tableHead">
              <tr>
                <th>Cédula</th>
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
                {beneficiaries}
              </tbody>
          </table>
        </div>
      );
    }
}

function mapStateToProps(state) {
  return {
    patients: state.patients,
    beneficiaries: state.beneficiaries,
    currentUser: state.currentUser,
    messages: state.messages
  };
}

export default connect(mapStateToProps, null)(
  Data
);
