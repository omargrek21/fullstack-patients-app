import React, { Component } from 'react';
const APIURL = '/api/patients/';

  class Search extends Component {
    static defaultProps = {
      onData() {}
    }
    constructor() {
      super();
      this.state = {
        dni: ''
      };
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const dni = this.state.dni;
        fetch(APIURL+dni)
        .then(response => response.json())
        .then(data => this.props.onData(data));
    }

    render() {
      const {dni} = this.state;
      return (
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
      );
    }
  }
    
export default Search;