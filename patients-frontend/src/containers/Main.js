import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AuthForm from "../components/AuthForm";
import { authUser } from "../store/actions/auth";
import { removeError } from "../store/actions/errors";
import withAuth from "../hocs/withAuth";
import Data from "./Data";
import Upload from "./Upload"

const Main = props => {
  const { authUser, errors, removeError } = props;
  return (
    <div className="container">
      <Switch>
        <Route
          exact
          path="/"
          component={ withAuth(Data) }
        />
        <Route
          exact
          path="/signin"
          render={props => {
            return (
              <AuthForm
                removeError={removeError}
                errors={errors}
                onAuth={authUser}
                buttonText="Iniciar sesión"
                heading="Bienvenido de vuelta"
                {...props}
              />
            );
          }}
        />
        <Route
          exact
          path="/upload"
          component={ withAuth(Upload) }
        />
        
      </Switch>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    errors: state.errors
  };
}

export default withRouter(
  connect(mapStateToProps, { authUser, removeError })(Main)
);
