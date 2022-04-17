import React from "react";
import "./FacebookSignIn.scss";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/facebookLogo.png";

function FacebookSignIn({ loading, signup }) {
  const history = useHistory();
  const { currentUser } = useAuth();
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
        const photoUrl = user.photoURL + "?height=500&access_token=" + accessToken;
        currentUser.updateProfile({ photoURL: photoUrl }).then(() => {
          history.push("/map");
        });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const errorEmail = error.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, errorEmail, credential);

        // ...
      });
  };

  return (
    <button className="facebook-signin" disabled={loading} onClick={facebookSignup}>
      <img className="facebook-signin__logo" src={logo} alt="facebook logo"></img>
      {signup ? `Sign up with Facebook` : "Log In With Facebook"}
    </button>
  );
}

export default FacebookSignIn;
