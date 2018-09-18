import React, { Component } from 'react';
import Data from './Data';
import Login from '../Login';
import Upload from '../Upload';
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import {Link, Route, Redirect} from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from "./Navbar";
import Main from "./Main";

const store = configureStore();

const App = () => (
  <Provider store={store}>  
    <Router>
      <div className="app">
        <Navbar />
        <Main />
      </div>
    </Router>
  </Provider>
);

export default App;
