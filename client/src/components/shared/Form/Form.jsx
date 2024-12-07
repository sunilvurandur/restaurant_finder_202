import { useState } from "react";
import InputType from "./InputType";
import { Link } from "react-router-dom";
import { handleLogin, handleRegister } from "../../../services/authService";
import "../../../styles/Form.css"; // Add the styles for the form here

const Form = ({ formType, submitBtn, formTitle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          if (formType === "login")
            return handleLogin(e, email, password, role);
          else if (formType === "register")
            return handleRegister(e, name, role, email, password, phone);
        }}
      >
        <h1 className="text-center">{formTitle}</h1>
        <hr />
        <div className="radio-group">
          <input
            type="radio"
            id="user"
            name="role"
            value="user"
            checked={role === "user"}
            onChange={(e) => setRole(e.target.value)}
          />
          <label htmlFor="user">User</label>

          <input
            type="radio"
            id="businessOwner"
            name="role"
            value="businessOwner"
            checked={role === "businessOwner"}
            onChange={(e) => setRole(e.target.value)}
          />
          <label htmlFor="businessOwner">Business Owner</label>
        </div>

        {/* Form fields for login and register */}
        {(() => {
          switch (formType) {
            case "login":
              return (
                <>
                  <InputType
                    labelText={"Email"}
                    labelFor={"forEmail"}
                    inputType={"email"}
                    name={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText={"Password"}
                    labelFor={"forPassword"}
                    inputType={"password"}
                    name={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              );
            case "register":
              return (
                <>
                  <InputType
                    labelText={"Name"}
                    labelFor={"forName"}
                    inputType={"text"}
                    name={"name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <InputType
                    labelText={"Email"}
                    labelFor={"forEmail"}
                    inputType={"email"}
                    name={"email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputType
                    labelText={"Password"}
                    labelFor={"forPassword"}
                    inputType={"password"}
                    name={"password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputType
                    labelText={"Phone"}
                    labelFor={"forPhone"}
                    inputType={"text"}
                    name={"phone"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </>
              );
            default:
              return null;
          }
        })()}

        <div className="d-flex flex-row justify-content-between">
          {formType === "login" ? (
            <p>
              Not registered yet? Register
              <Link to="/register"> Here!</Link>
            </p>
          ) : (
            <p>
              Already a user? Please
              <Link to="/login"> Login!</Link>
            </p>
          )}
          <button className="btn btn-primary" type="submit">
            {submitBtn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
