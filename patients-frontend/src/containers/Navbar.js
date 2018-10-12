import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import  Search  from './Search'
import './Navbar.css';
import logo from './logo-1.svg';

class Navbar extends Component {
  logout = e => {
    e.preventDefault();
    this.props.logout();
  };
  render() {
    return (
      <div>
        {this.props.currentUser.isAuthenticated ? (
          <ul className='header'>
            <li className='logo-container'><Link to="/"><img src={logo} alt="Venemergencia"/></Link></li>
            <li className='search'><Search className="findForm" onData = {this.handleData} /></li>
            <li className='final-buttons'><a onClick={this.logout}>{this.props.currentUser.user.name} {this.props.currentUser.user.lastname} <i className="fas fa-power-off"></i></a></li>
          </ul>
        ) : (
          <ul className='header'>
            <li className='logo-container'><img src={logo} alt="Venemergencia"/></li>
            <li className='final-buttons'><Link to="/signin"><i className="fas fa-sign-in-alt"></i></Link></li>
          </ul>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default connect(mapStateToProps, { logout })(Navbar);
