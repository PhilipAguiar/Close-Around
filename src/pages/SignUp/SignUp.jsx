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
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    setUploadAvatar(e.target.files[0]);
    setAvatar(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== confirmRef.current.value) {
      return setError("passwords dont match");
    }

    try {
      signup(emailRef.current.value, passwordRef.current.value).then(()=>{
        if (currentUser) {
          upload(uploadAvatar, currentUser).then((res)=>{
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
   
    setLoading(false);
  };

  return (
    <div className="signup">
      <form className="signup__form" onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <div className="signup__input-wrapper">
          <label className="signup__label">Full Name</label>
          <input className="signup__input" name="name" ref={nameRef} />

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
        <p className="signup__button">
          Have an account? <Link to={"/login"}> Please log in!</Link>
        </p>
        <FacebookSignIn loading={loading} signup={signup} />
      </form>
    </div>
  );
}

export default SignUp;
