import React, { Component } from 'react';
import PatientItem from './PatientItem';
import Upload from './Upload';
import Search from './Search';
import './Data.css';
//const APIURL = '/api/patients';

class Data extends Component {
    constructor(props){
      super(props);
      this.state = {
        patients : []
      }
      this.handleData = this.handleData.bind(this);
    }
    
    /*componentWillMount() {
      fetch(APIURL)
      .then(response => response.json())
      .then(patients => this.setState({patients}));
    }*/
    
    handleData(data){
      console.log("recibido:", data);
      const patients = [...data];
      this.setState({patients});
    }
    
    render() {
        const patients = this.state.patients.map((patient,index) => (
              <PatientItem
                color = {index % 2 ===0 ? 'par' : 'impar'}
                key = {patient._id}
                {...patient}
              />
          ));
      
        return(
          <div className="data">
            
            <Search className="findForm" onData = {this.handleData} />
            <table className="dataTable">
              <thead className="tableHead">
                <tr>
                  <th>beneficiario</th>
                  <th>titular</th>
                  <th>nombre completo</th>
                  <th>f.nac.</th>
                  <th>ubicación</th>
                  <th>tipo</th>
                  <th>contratante</th>
                  <th>ramo</th>
                  <th>aseguradora</th>
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