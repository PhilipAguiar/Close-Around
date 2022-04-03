import React, { useState } from "react";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import FacebookSignIn from "../../components/FacebookSignIn/FacebookSignIn";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.scss"

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/map");
    } catch {
      setError("failed to Login");
    }
    setLoading(false);
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <label className="login__label">Email</label>
        <input className="login__input" type="email" name="email" ref={emailRef} />
        <label className="login__label">Password</label>
        <input className="login__input" type="password" name="password" ref={passwordRef} />
        <button className="login__button" disabled={loading}>Login</button>
      <FacebookSignIn loading={loading} />
      <p className="signup__button">
        Need an account? <Link to={"/signup"}> Please sign up!</Link>
      </p>
      </form>
    </div>
  );
}

export default Login;
