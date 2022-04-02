import React, { useState } from "react";
import { useRef } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../../contexts/AuthContext";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmRef = useRef();
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
    }
    setLoading(false);
  };

  const facebookSignup = () => {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        history.push("/map");
        const photoUrl = user.photoURL + "?height=500&access_token=" + accessToken;
        console.log(photoUrl)
        currentUser.updateProfile({ photoURL: photoUrl });
        console.log(currentUser.photoURL)
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <label>Email</label>
        <input type="email" name="email" ref={emailRef} />
        <label>Password</label>
        <input type="password" name="password" ref={passwordRef} />
        <label>Confirm password</label>
        <input type="password" name="confirm" ref={confirmRef} />
        <button disabled={loading}>Sign Up</button>
      </form>
      <button disabled={loading} onClick={facebookSignup}>
        Sign Up With Facebook
      </button>
      <div>
        Have an account? <Link to={"/login"}> Please log in!</Link>
      </div>
    </>
  );
}

export default SignUp;
