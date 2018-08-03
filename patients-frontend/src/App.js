import React, { Component } from 'react';
import Data from './Data';
import Login from './Login';
import Upload from './Upload';
import { Helmet } from 'react-helmet';
import './App.css';
import {Link, Route, Redirect} from "react-router-dom";

class App extends Component {
  render() {
    
    return (
      <div className="App">
        <Helmet>
            <title>Data Venemergencia</title>
          </Helmet>
        <Route path="/upload" component= {Login}> </Route>
        <Data name = 'Pedro' />
      </div>
    );
  }
}

export default App;
