import React, { Component } from "react";
import './Auth.css';

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: ""      
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const authType = this.props.signUp ? "signup" : "signin";
    this.props
      .onAuth(authType, this.state)
      .then(() => {
        this.props.history.push("/");
      })
      .catch(() => {
        return;
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { username, password } = this.state;
    const {
      signUp,
      heading,
      buttonText,
      errors
    } = this.props;

    return (
      <div className='authContainer'>
        <h2>{heading}</h2>
        <form className='authForm' onSubmit={this.handleSubmit}>
          {errors.message && (
            <div className="errormsg"><i class="fas fa-exclamation-triangle"></i> {errors.message}</div>
          )}
          <div className='fieldContainer'> 
            <label htmlFor="username"><i class="fas fa-user"></i></label>
            <input
              className='loginInputs'
              autoComplete="off"
              id="username"
              name="username"
              onChange={this.handleChange}
              type="text"
              placeholder="usuario"
              value={username}
            />
          </div>
          <div className='fieldContainer'> 
            <label htmlFor="password"><i class="fas fa-lock"></i></label>
            <input
              className='loginInputs'
              autoComplete="off"
              id="password"
              name="password"
              placeholder="contraseña"
              onChange={this.handleChange}
              type="password"
              value={password}
            />
          </div>
          {signUp && (
            <div>
              <label htmlFor="username">Username</label>
              <input
                autoComplete="off"
                className="form-control"
                id="username"
                name="username"
                onChange={this.handleChange}
                type="text"
                value={username}
              />
              
            </div>
          )}
          <button className='btn'
            type="submit"
          >
            {buttonText}
          </button>
        </form>
      </div>
    );
  }
}

export default AuthForm;
