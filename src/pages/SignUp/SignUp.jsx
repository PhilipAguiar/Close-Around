import React, { useState } from "react";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../../contexts/AuthContext";
import FacebookSignIn from "../../components/FacebookSignIn/FacebookSignIn";
import "./SignUp.scss";

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const nameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== confirmRef.current.value) {
      return setError("passwords dont match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch {
      setError("failed to create account");
    }
    if (currentUser) {
      currentUser.updateProfile({
        displayName: "hello",
      });
      history.push("/map")
    }
    setLoading(false);

  };

  return (
    <div className="signup">
      <form className="signup__form" onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <div className="signup__input-wrapper">

        <label className="signup__label">Full Name</label>
        <input className="signup__input" name="name" ref={nameRef} />
        <label className="signup__label">Email</label>
        <input className="signup__input" type="email" name="email" ref={emailRef} />
        </div>
        <div className="signup__input-wrapper">
        <label className="signup__label">Password</label>
        <input className="signup__input" type="password" name="password" ref={passwordRef} />
        </div>
        <div className="signup__input-wrapper">
        <label className="signup__label">Confirm password</label>
        <input className="signup__input" type="password" name="confirm" ref={confirmRef} />
        </div>
        <button className="signup__button" disabled={loading}>
          Sign Up
        </button>
        <FacebookSignIn loading={loading} signup={signup} />
        <p className="signup__button">
          Have an account? <Link to={"/login"}> Please log in!</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
