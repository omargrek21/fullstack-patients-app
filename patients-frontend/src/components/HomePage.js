import React from "react";
import { Link, Route, Redirect } from "react-router-dom";
import Data from "../containers/Data";
import AuthForm from "./AuthForm";

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

export default Homepage;
