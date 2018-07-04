import React, { Component } from 'react';
import Data from './Data';
import './App.css';
import {Link, Route, Redirect} from "react-router-dom";

class App extends Component {
  render() {
    
    return (
      <div className="App">
        <Data />
      </div>
    );
  }
}

export default App;
