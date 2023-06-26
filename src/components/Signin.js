import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import './Signin.css'
import {Link, useNavigate} from 'react-router-dom';
import logo from "../images+screenshots/instagram-text.png"
import logo1 from "../images+screenshots/logo1.png"
import googleplay from "../images+screenshots/google-play.png"
import microsoft from "../images+screenshots/microsoft.png"
import { useStateValue } from "../stateprovider";
import facebook1 from "../images+screenshots/facebook1.jpg";
import "../App.css"

import { ThemeContext } from "../App";





function SignIn() {

  const { theme, toggleTheme } = useContext(ThemeContext);

    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [{}, dispatch] = useStateValue();

  const handleSubmit = (e) => {
    e.preventDefault(); 
    signInWithEmailAndPassword(auth, email, password).then((userCredential)=>{
       const newUser = {
    username: userCredential.user.displayName,
    photoURL: userCredential.user.photoURL,
    email: userCredential.user.email,
    uid: userCredential.user.uid
   };
 dispatch({
  type: 'SET_USER',
  user: newUser,
 })


   localStorage.setItem('user', JSON.stringify(newUser));
   navigate(`/`);
    }).catch(err=> alert(err))

  
  };

  return (
    <div className="signin_container">
       <div className="signin ">
      <div>
      {theme === 'dark' ? <img src={logo1} className="signin_logo"/>
: <img src={logo} className="signin_logo"/>}

      </div>
      <form onSubmit={handleSubmit}>
        <div>
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
        <br />
        <button onClick={handleSubmit} type="submit">Log In</button>
      </form>
      <div className="or d-flex mt-5">
      <span><hr/></span> <p className="mt-1">OR</p>  <span><hr/></span> 
      </div>
      <div type="submit" className="facebook-logo1 mt-3">
        <img src={facebook1} /> Log in with Facebook
      </div>
    </div>

    <div>  
      <p className="rout-to-login">
          Don't have an account? <Link to={"/signup"}>Sign up</Link>
        </p>  <p className="text">
          Get the app.
        </p>
        <div className="app_images">
        <img src={googleplay} />
        <img src={microsoft}/>
        </div>
      
    </div>
    </div>
   
  );
}

export default SignIn;
