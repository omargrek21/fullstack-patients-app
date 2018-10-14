import React from "react";
import { Link, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Data from "../containers/Data";
import AuthForm from "./AuthForm";
import { authUser } from "../store/actions/auth";
import { removeError } from "../store/actions/errors";

const Homepage = (props) => {
 const { authUser, errors, removeError, currentUser, loading } = props;
 console.log(loading);
  if (!currentUser.isAuthenticated) {
    return (
        <AuthForm
            removeError={removeError}
            errors={errors}
            onAuth={authUser}
            loading ={loading}
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
    errors: state.errors,
    loading: state.loading
  };
}

export default connect(mapStateToProps, { authUser, removeError })(Homepage);


