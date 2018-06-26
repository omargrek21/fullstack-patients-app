import React, { Component } from 'react';
import PatientItem from './PatientItem';
import Upload from './Upload';
import Search from './Search';
//const APIURL = '/api/patients';

class Data extends Component {
    constructor(props){
      super(props);
      this.state = {
        patients : [],
      }
      this.handleData = this.handleData.bind(this);
    }
    
    /*componentWillMount() {
      fetch(APIURL)
      .then(response => response.json())
      .then(patients => this.setState({patients}));
    }*/
    
    handleData(data){
      const patients = [...data];
      this.setState({patients});
    }
    
    render() {
        const patients = this.state.patients.map(patient => (
              <PatientItem
                key = {patient._id}
                {...patient}
              />
          ));
      
        return(
          <div>
            <Upload />
            <Search onData = {this.handleData} />
            <table>
            <thead>
              <tr>
                <th>CI Beneficiario</th>
                <th>CI Titular</th>
                <th>Nombre completo</th>
                <th>F. Nacimiento</th>
                <th>Ubicación</th>
                <th>Tipo</th>
                <th>Contratante</th>
                <th>Ramo</th>
                <th>Aseguradora</th>
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

export default Data;