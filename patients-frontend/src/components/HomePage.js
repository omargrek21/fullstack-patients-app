import React from "react";
import { Link, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Data from "../containers/Data";
import AuthForm from "./AuthForm";
import { authUser } from "../store/actions/auth";
import { removeError } from "../store/actions/errors";

const Homepage = (props) => {
 const { authUser, errors, removeError, currentUser } = props;
  if (!currentUser.isAuthenticated) {
    return (
        <AuthForm
            removeError={removeError}
            errors={errors}
            onAuth={authUser}
            buttonText="Iniciar sesión"
            {...props}
        />
    );
  }
  return (
    <div>
      <Data/>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    errors: state.errors
  };
}

export default connect(mapStateToProps, { authUser, removeError })(Homepage);


