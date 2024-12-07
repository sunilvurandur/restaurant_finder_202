import React from "react";
import banner2 from "../../assets/banner1.jpg";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";
import "../../styles/Register.css"; // Add this for custom styling

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <div className="register-container">
      {error && <span>{alert(error)}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="register-wrapper">
          {/* Left side: Banner */}
          <div className="register-banner">
            <img src={banner2} alt="Register Illustration" className="register-image" />
          </div>

          {/* Right side: Form */}
          <div className="register-form-container">
            <Form
              formTitle={"Register"}
              submitBtn={"Register"}
              formType={"register"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
