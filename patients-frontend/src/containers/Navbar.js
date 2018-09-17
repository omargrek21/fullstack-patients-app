import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { Search } from './Search'

class Navbar extends Component {
  logout = e => {
    e.preventDefault();
    this.props.logout();
  };
  render() {
    return (
      <nav className="navbar navbar-expand">
        <div className="container-fluid">
          <div className="navbar-header">
            
          </div>
          {this.props.currentUser.isAuthenticated ? (
            <div>
               <Search className="findForm" onData = {this.handleData} />
               <ul className="nav navbar-nav navbar-right">             
                <li>
                  <a onClick={this.logout}>Log out</a>
                </li>
              </ul>
            </div>            
          ) : (
            <ul className="nav navbar-nav navbar-right">              
              <li>
                <Link to="/signin">Inicia sesión</Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

export default connect(mapStateToProps, { logout })(Navbar);
