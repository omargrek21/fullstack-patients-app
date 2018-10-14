import React, { Component } from 'react';
import { connect } from "react-redux";
import PatientItem from '../components/PatientItem';
import PatientGps from '../components/PatientGps';
import '../Data.css';
import { Link } from "react-router-dom";

class Data extends Component { 
      render() {
      let patients = [];
      if(this.props.searchType.type === 'gps'){
        patients = this.props.patients.map((patient,index) => (
          <PatientGps
            color = {index % 2 ===0 ? 'even' : 'odd'}
            key = {patient._id}
            {...patient}
          />
        )); 
      } else{
        patients = this.props.patients.map((patient,index) => (
          <PatientItem
            color = {index % 2 ===0 ? 'even' : 'odd'}
            key = {patient._id}
            {...patient}
          />
        )); 
      }
      const beneficiaries = this.props.beneficiaries.map((patient,index) => (
        <PatientItem
          color = {index % 2 ===0 ? 'even' : 'odd'}
          key = {patient._id}
          {...patient}
        />
      ));
     
      return(
        <div style={{textAlign:'center', marginTop:'50px'}}>
        {this.props.currentUser.user.role === 'admin' && (<Link className='upload' to='/upload'> <i className="fas fa-cloud-upload-alt"> <span className='lighter'> CARGAR DATA </span></i> </Link>)}
          {this.props.searchType.type === 'gps' ? (
            <div className="data">
              <h3> Usuario LifeAlert (TrackerGPS): {this.props.messages.patients} </h3>
              <table className="dataTable">
                <thead className="tableHead">
                  <tr>
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Dirección</th>
                    <th>Fecha Nac.</th>
                    <th>Teléfono dispositivo</th>
                    <th>Teléfono paciente</th>
                    <th>Persona contacto 1</th>
                    <th>Persona contacto 2</th>
                    <th>Persona contacto 3</th>
                  </tr>
                </thead>
                  <tbody>
                    {patients}
                  </tbody>
              </table>
            </div>
          ) : (
            <div className="data">
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
              <h3 style={{fontWeight:'lighter', marginTop:'50px'}}> Beneficiarios: {this.props.messages.beneficiaries} </h3>
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
          )}
        </div>
        
      );
    }
}

function mapStateToProps(state) {
  return {
    patients: state.patients,
    beneficiaries: state.beneficiaries,
    currentUser: state.currentUser,
    messages: state.messages,
    searchType: state.searchType
  };
}

export default connect(mapStateToProps)(Data);
