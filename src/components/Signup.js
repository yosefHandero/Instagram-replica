import React, { useContext, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "./Firebase";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import googleplay from "../images+screenshots/google-play.png";
import microsoft from "../images+screenshots/microsoft.png";
import logo from "../images+screenshots/instagram-text.png";
import logo1 from "../images+screenshots/logo1.png";

import facebook from "../images+screenshots/facebook.png";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { ThemeContext } from "../App";


function Signup() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [photoURL, SetPhotoURL] = useState("");
  const navigate = useNavigate();

  const createAccount = async(e) => {
    e.preventDefault();
    const username_query = await query(
      collection(db, "users"),
      where("userName", "==", username)
    );
    const username_exists = await getDocs(username_query);

    if(username_exists.docs.length === 0) {
      if(username.length > 0 && email.length > 0 && password.length > 0) {
        createUserWithEmailAndPassword(auth,email,password).then(async(userCredential)=>{
          updateProfile(userCredential.user, {
            displayName:username,
            photoURL: photoURL
          });

          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            username,
            photoURL,
          });
          setEmail("");
          setPassword("");
          SetPhotoURL("");
          setUsername("");
          navigate("/");

          alert("Your Accoount is Created")

        }).catch((err)=> alert(err))
      } else {
        alert('Please fill the input')
      } 
    }else {
      alert('user Name exists ');
    }
  }


  return (
    <div className="signup_container">
      <div className="signup">
      <div className="instagram-logo">
      {theme === 'dark' ? <img src={logo1} className="signin_logo"/>
: <img src={logo} className="signin_logo"/>}

      </div>
      <h6>
        Sign up to see photos and videos <br />
        <center>from your friends.</center>
      </h6>
      <br />
      <button type="submit" className="facebook-logo">
        <img src={facebook} /> Log in with Facebook
      </button>

      <form onSubmit={createAccount}>
      <br />

        <div>
        <div>
          <input
            type="username"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
   
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="info">
          People who use our service may have uploaded <br />{" "}
          <center>
            your contact information to Instagram.
            <a href={"/signup"}> Learn</a>
          </center>{" "}
          <a href={"/signup"}>
            {" "}
            <center> More</center>
          </a>
          <br />
          By signing up, you agree to our
          <a href={"/signup"}>Terms , Privacy</a>
          <center>
            <a href={"/signup"}>Policy</a>
            and
            <a href={"/signup"}> Cookies Policy .</a>
          </center>
        </p>
        <button 
        onClick={createAccount}
        type="submit"
        >Sign up</button>
        <br/>
      
      </form>
    </div>
    <p className="rout-to-login">
            Have an account? <Link to={"/login"}>Log in</Link>
          </p>
        <center><p>Get the app.</p></center>

          <div className="apps">
       <img src={googleplay} />
       <img src={microsoft} />
     </div>
    </div>
    
  );
}

export default Signup;
