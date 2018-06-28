import React, { Component } from 'react';
const APIURL = '/api/patients';

  class Upload extends Component {
    constructor() {
      super();
      this.state = {
        selectedFile: '',
        status: '', 
        cleanData: false
      };
    }

    onChange = (e) => {
      // event to update state when form inputs change
      switch (e.target.name) {
        case 'selectedFile':
          this.setState({ selectedFile: e.target.files[0] });
          break;
        case 'cleanData':
          this.setState({cleanData: e.target.checked});
          break;
        default:
          this.setState({ [e.target.name]: e.target.value });
      }
    }

    onSubmit = (e) => {
      
      e.preventDefault();
      this.setState({status:'Cargando...'});
      const {selectedFile, cleanData } = this.state;
      let formData = new FormData();
      formData.append('selectedFile', selectedFile);
      formData.append('cleanData', cleanData);
      
      fetch(APIURL, {
        method: "POST",
        body: formData
      })
      .then(resp => {
        if(!resp.ok) {
          if(resp.status >=400 && resp.status < 500) {
            return resp.json().then(data => {
              let err = {errorMessage: data.message};
              this.setState({status:'error: ' + data.message});
              throw err;
            })
          } else {
            let err = {errorMessage: 'Please try again later, server is not responding'};
            this.setState({status:'Por favor intente de nuevo más tarde, el servidor no está respondiendo'});
            throw err;
          }
        }
        return resp.json()
      })
      .then(data => {
        if(data.uploaded) {
          this.setState({status:'Archivo cargado exitosamente',selectedFile: '',cleanData: false});
          document.getElementById('selectedFile').value = null;
        } else {
          this.setState({status:'Error cargando el archivo, por favor intente de nuevo'});
        }
      })
    }

    render() {
      const {status, cleanData} = this.state;
      return (
        <div>
          <form onSubmit={this.onSubmit}>
            <input
              type="file"
              id = "selectedFile"
              name="selectedFile"
              accept=".csv"
              onChange={this.onChange}
            />
            <br/>
            <label>
              <input
                type="checkbox"
                name="cleanData"
                value = {cleanData}
                checked = {cleanData}
                onChange={this.onChange}
              />
              Borrar data previa
            </label>
            <br/>
            <button type="submit">Cargar archivo</button>
          </form>
          <p>{status}</p>
        </div>
      );
    }
  }
    
export default Upload;