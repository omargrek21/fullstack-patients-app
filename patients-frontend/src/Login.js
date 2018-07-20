import React, { Component } from 'react';
import {Link, Route, Redirect} from "react-router-dom";
import Upload from './Upload';
import './Login.css';
const APIURL = '/api/users/login';

//const APIURL = '/api/patients';

class Login extends Component {
    constructor(props){
      super(props);
      this.state = {
        logged: false,
        username: '',
        password: '',
        status: ''
      };
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(e) {
        e.preventDefault();
        console.log('logeando');
        const {username, password} = this.state;
        const data = {
            username: username,
            password: password
        };
        console.log('data',data);
        fetch(APIURL, {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(data)
        })
        .then(resp => {
            console.log(resp);
          if(!resp.ok) {
            if(resp.status >=400 && resp.status < 500) {
              return resp.json().then(data => {
                let err = {errorMessage: data.errorDetail};
                this.setState({status:data.errorMsg});
                throw err;
              })
            } else {
              let err = {errorMessage: 'Server down, check status'};
              this.setState({status:'Por favor intente de nuevo más tarde, el servidor no está respondiendo'});
              throw err;
            }
          }
          return resp.json()
        })
        .then(data => {
          console.log(data);
          if(data.auth){
            this.setState({status:'Acceso concedido!'});
          } else {
            this.setState({status:'Acceso no autorizado!'});
          } 
          this.setState({logged:data.auth});
        });
    }
    
    
    render() {
        const {username, password, status, logged} = this.state;
        return(
          <div className="container">
              <p> Por favor valida tu acceso </p>
              <form className="loginForm" onSubmit={this.handleSubmit}>
                <input
                  className="loginInputs"
                  type="text"
                  name="username"
                  placeholder="usuario"
                  autoComplete = "off"
                  value={username}
                  onChange={(e) => this.setState({[e.target.name]: e.target.value })}
                />
                <br/>
                <input
                  className="loginInputs"
                  type="text"
                  name="password"
                  placeholder="contraseña"
                  autoComplete = "off"
                  value={password}
                  onChange={(e) => this.setState({[e.target.name]: e.target.value })}
                />
                <button type="submit">Login</button>
              </form>
              <p>{status}</p>
              {
                
                !logged
                ? null
                : (
                    <Upload/>
                  )
              }
              
        </div>
        );
    }
}

export default Login;