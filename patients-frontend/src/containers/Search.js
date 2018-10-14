import React, { Component } from 'react';
import { connect } from "react-redux";
import { findPatients } from "../store/actions/patients";
import { css } from 'react-emotion';
import { BeatLoader } from 'react-spinners';

const override = css`
    text-align: center;
    margin-top:5px;
`;

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
        <div className='searchContainer'>
          <form className='searchForm' onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="dni"
              placeholder="CI o teléfono"
              value={dni}
              onChange={(e) => this.setState({[e.target.name]: e.target.value })}
            />
            <button className='tuleke' type="submit"><i className="fas fa-search"></i></button>
          </form>
          <BeatLoader
            className={override}
            sizeUnit={"px"}
            size={15}
            color={'#E32726'}
            loading={this.props.loading.loading}
          />
          {this.props.errors.message && (
            <div className="errormsgSearch"><i className="fas fa-exclamation-triangle"></i> {this.props.errors.message}</div>
          )}          
        </div>
      );
    }
  }

  function mapStateToProps(state) {
    return {
      errors: state.errors,
      loading: state.loading
    };
  }
  export default connect(mapStateToProps, { findPatients })(Search);   
