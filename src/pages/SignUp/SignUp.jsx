import React, { useState } from "react";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth, upload } from "../../contexts/AuthContext";
import FacebookSignIn from "../../components/FacebookSignIn/FacebookSignIn";
import "./SignUp.scss";
import defaultAvatar from "../../assets/icons/default-user.svg";

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
  const nameRef = useRef();
  const [uploadAvatar, setUploadAvatar] = useState(defaultAvatar);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(error);
  const [emailError, setEmailError] = useState(error);
  const [passwordError, setPasswordError] = useState(error);
  const [confirmPasswordError, setConfirmPasswordError] = useState(error);
  const history = useHistory();
  const { signup } = useAuth();
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    setUploadAvatar(e.target.files[0]);
    setAvatar(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameRef.current.value) {
      setNameError(true);
    } else {
      setNameError(false);
    }
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
    if (!confirmRef.current.value) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }

    if (passwordRef.current.value !== confirmRef.current.value) {
      return setError("Passwords do not match");
    }

    // Error Checking

   

    if (nameRef.current.value && emailRef.current.value && passwordRef.current.value && confirmRef.current.value) {
      try {
        signup(emailRef.current.value, passwordRef.current.value).then(() => {
          if (currentUser) {
            upload(uploadAvatar, currentUser).then((res) => {
              currentUser
                .updateProfile({
                  displayName: nameRef.current.value,
                  photoURL: res,
                })
                .then(() => {
                  console.log(currentUser);
                  history.push("/map");
                });
            });
          }
        });
      } catch {
        setError("failed to create account");
      }
    }

    setLoading(false);
  };

  return (
    <div className="signup">
      <form className="signup__form" onSubmit={handleSubmit}>
        {error && <h1>{error}</h1>}

        <div className="signup__input-wrapper">
          <label className="signup__label">Full Name</label>
          <input className={`signup__input ${nameError && "signup__input--error"}`} name="name" ref={nameRef} />{" "}
        </div>

        <label className="signup__label">Avatar Image</label>
        <div className="signup__input-wrapper signup__avatar-wrapper">
          <input
            type="file"
            accept="image/png, image/jpg"
            name="avatar"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <img className="signup__avatar" src={avatar} alt="avatar" />
        </div>

        <label className="signup__label">Email</label>
        <input className={`signup__input ${emailError && "signup__input--error"}`} type="email" name="email" ref={emailRef} />

        <div className="signup__input-wrapper">
          <label className="signup__label">Password</label>
          <input className={`signup__input ${passwordError && "signup__input--error"}`} type="password" name="password" ref={passwordRef} />
        </div>

        <div className="signup__input-wrapper">
          <label className="signup__label">Confirm password</label>
          <input className={`signup__input ${confirmPasswordError && "signup__input--error"}`} type="password" name="confirm" ref={confirmRef} />
        </div>

        <button className="signup__button" disabled={loading}>
          Sign Up
        </button>
        <p className="signup__button">
          Have an account? <Link to={"/login"}> Please log in!</Link>
        </p>
        <FacebookSignIn loading={loading} signup={signup} />
      </form>
    </div>
  );
}

export default SignUp;
