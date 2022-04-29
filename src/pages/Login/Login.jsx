import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FacebookSignIn from "../../components/FacebookSignIn/FacebookSignIn";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.scss";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { currentUser } = useAuth();
  const [emailError, setEmailError] = useState(error);
  const [passwordError, setPasswordError] = useState(error);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRef.current.value) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
    if (!passwordRef.current.value) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    if (emailRef.current.value && passwordRef.current.value) {
      try {
        setError("");
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        history.push("/map");
      } catch {
        setError("Failed to Login");
      }
    }
    setLoading(false);
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        {error && <p className="login__error">{error}</p>}
        <label className="login__label">Email</label>
        <input className={`signup__input ${emailError && "signup__input--error"}`} type="email" name="email" ref={emailRef} />
        <label className="login__label">Password</label>
        <input className={`signup__input ${passwordError && "signup__input--error"}`} type="password" name="password" ref={passwordRef} />
        <button className="login__button" disabled={loading}>
          Login
        </button>
        <FacebookSignIn loading={loading} />
        <p className="signup__button">
          Need an account? <Link to={"/signup"}> Please sign up!</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
