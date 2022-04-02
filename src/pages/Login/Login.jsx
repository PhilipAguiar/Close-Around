import React, { useState } from "react";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/map")
    } catch {
      setError("failed to Login");
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <label>Email</label>
        <input type="email" name="email" ref={emailRef} />
        <label>Password</label>
        <input type="password" name="password" ref={passwordRef} />
        <button disabled={loading}>Login</button>
      </form>
      <div>Need an account? <Link to ={"/signup"}> Please sign up!</Link></div>
    </>
  );
}

export default Login;
