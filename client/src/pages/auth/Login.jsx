import React from "react";
import banner1 from "../../assets/banner1.jpg";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";
import "../../styles/Login.css"; // Add custom styles here

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className="login-container">
      {error && <span>{alert(error)}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="login-wrapper">
          {/* Left side: Image or banner */}
          <div className="login-banner">
            <img src={banner1} alt="Login Illustration" className="login-image" />
          </div>

          {/* Right side: Form */}
          <div className="login-form-container">
            <Form
              formTitle={"Login to Dashboard"}
              submitBtn={"Login"}
              formType={"login"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
