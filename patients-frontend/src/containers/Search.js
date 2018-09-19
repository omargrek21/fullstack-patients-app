import React, { Component } from 'react';
import { connect } from "react-redux";
import { findPatients } from "../store/actions/patients";

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
    
    handleSubmit = e => {
      e.preventDefault();
      this.props.findPatients(this.state.dni);        
    }

    render() {
      const { dni } = this.state;
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
