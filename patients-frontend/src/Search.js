import React, { Component } from 'react';
const APIURL = '/api/patients/';

  class Search extends Component {
    static defaultProps = {
      onData() {}
    }
    constructor() {
      super();
      this.state = {
        dni: '',
        status: ''
      };
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const dni = this.state.dni;
        fetch(APIURL+dni)
        .then(resp => {
          if(!resp.ok) {
            if(resp.status >=400 && resp.status < 500) {
              return resp.json().then(data => {
                let err = {errorMessage: data.error};
                this.setState({status:'error: ' + data.error});
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
          if(data.length === 0){
            this.setState({status:'Cédula no registrada'});
          } else {
            this.setState({status:''});
          }
          this.props.onData(data);
        });
    }

    render() {
      const {dni, status} = this.state;
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="dni"
              placeholder="Filtrar por CI"
              value={dni}
              onChange={(e) => this.setState({[e.target.name]: e.target.value })}
            />
            <button type="submit">Buscar</button>
          </form>
          <p>{status}</p>
        </div>
      );
    }
  }
    
export default Search;