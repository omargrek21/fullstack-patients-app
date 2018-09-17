import React, { Component } from 'react';
import Data from '../Data';
import Login from '../Login';
import Upload from '../Upload';
import { Helmet } from 'react-helmet';
import {Link, Route, Redirect} from "react-router-dom";
import { Provider } from 'react-redux';
import { configureStore } from '../store';
import { BrowserRouter as Router } from 'react-router-dom';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="App">
        <Helmet>
            <title>Data Venemergencia</title>
          </Helmet>
        <Route path="/upload" component= {Login}> </Route>
        <Data name = 'Pedro' />
      </div>
    </Router>
  </Provider>
);

export default App;
