import React, { Component } from 'react';
import Data from './Data';
import Login from './Login';
import Upload from './Upload';
import './App.css';
import {Link, Route, Redirect} from "react-router-dom";

class App extends Component {
  render() {
    
    return (
      <div className="App">
      <Route path="/upload" component= {Upload}> </Route>
      <Data> </Data>
        
        
      </div>
    );
  }
}

export default App;
