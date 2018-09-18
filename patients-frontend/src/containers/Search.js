import React, { Component } from 'react';
import { connect } from "react-redux";
import { findPatients } from "../store/actions/patients";

  class Search extends Component {
    constructor() {
      super();
      this.state = {
        dni: ''
      };
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.findPatients(this.state.dni);

        /*const dni = this.state.dni;
        fetch(APIURL+dni)
        .then(resp => {
          if(!resp.ok) {
            if(resp.status >=400 && resp.status < 500) {
              return resp.json().then(data => {
                let err = {errorMessage: data.error.message};
                this.setState({status:data.error.message});
                throw err;
              })
            } else {
              let err = {errorMessage: 'Server down, check status'};
              this.setState({status:'Por favor intente de nuevo más tarde, el servidor no está respondiendo'});
              throw err;
            }
          }
          return resp.json()
        })
        .then(data => {
          console.log(data);
          if(data.success){
            if(data.patients.length === 0){
              this.setState({status:'Cédula no registrada'});
            } else {
              this.setState({status:''});
            }
            this.props.onData(data.patients);
          } else {
            this.setState({status:data.error.message});
          }
        });*/
    }
    render() {
      const {dni} = this.state;
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="dni"
              placeholder="Introduzca CI"
              value={dni}
              onChange={(e) => this.setState({[e.target.name]: e.target.value })}
            />
            <button type="submit">Buscar</button>
          </form>
          {this.props.errors.message && (
            <div className="alert alert-danger">{this.props.errors.message}</div>
          )}          
        </div>
      );
    }
  }

  function mapStateToProps(state) {
    return {
      errors: state.errors
    };
  }
  export default connect(mapStateToProps, { findPatients })(Search);   
