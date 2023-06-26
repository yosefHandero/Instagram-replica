import React, { useState, useContext   } from "react";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import HomeIcon from '@mui/icons-material/Home';
import InstagramIcon from '@mui/icons-material/Instagram';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import "./NavigationBar.css";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./Firebase";
import {  useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useStateValue } from "../stateprovider";
import { ThemeContext } from "../App";
import ReactSwitch from "react-switch";
import logo from "../images+screenshots/instagram-text.png"
import logo1 from "../images+screenshots/logo1.png"





function NavigationBar() {

  const { theme, toggleTheme } = useContext(ThemeContext);
  



  const [{ user }, dispatch] = useStateValue();
  const [imageURL, setImageURL] = useState("");
  const [caption, setCaption] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openMenu, SetOpenMenu] = useState(false);
  const navigate = useNavigate();

 

  // Adding data to cloud firestore//
  const createPost = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "posts"),{
      imageURL,
      caption,
      timestamp: serverTimestamp(),
      username: user?.username,
      photoURL: user?.photoURL == null ? "./icons2.png" : user.photoURL,

    });
    alert ("post created ")
    setCaption("");
    setImageURL("");
    setOpenDialog(false);
  }

  // Adding data to cloud firestore//

  const logOut = (e) => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        dispatch({
          type: "SET_USER",
          user: null,
        });
        navigate("/login");
      })
      .catch((err) => alert(err));
  };

  function addTwoNumbers() {
    let numOne = 2
    let numTwo = 3
    let total = numOne + numTwo
    return total

}

console.log(addTwoNumbers())

  return (
    <Container className="nav" 
    id={theme}
    >
      <Dialog
      className="dialog_container"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          style={{
            height: 100,
            textAlign: "center"
          }}
          className="DialogTitle"
          id={theme}
        >
          Create new post
        </DialogTitle>
        <DialogContent
          id={theme}
        
        >
          <CreatePostForm>
            <InputContainer style={{ marginRight: 20, paddingTop: 5 }}>
              <input
                placeholder="ImageURL"
                className="ml-2 "
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
            </InputContainer>
            <InputContainer style={{ marginBottom: 75, paddingBottom: 200 }}>
              <textarea
                placeholder="Caption"
                id={theme}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </InputContainer>
          </CreatePostForm>
        </DialogContent>
        <DialogActions 
          id={theme}

        style={{ width: 200, marginLeft: 400 }}>
          <PostCTAButtons 
          id={theme}

          >
            <button className="cancel-button" onClick={()=> setOpenDialog(false)}>Cancel</button>
            <button className="post-button" onClick={createPost}>Post</button>
          </PostCTAButtons>
        </DialogActions>
      </Dialog>
     
      <div className="logo"></div>
      <nav className="nav1">
        <ul className="my-4 nav_ul"
         id={theme}
         >
          <li>
            <div className="logo_img">
            {theme === 'dark' ? <img src={logo1} className="signin_logo"/>
: <img src={logo} className="signin_logo"/>}
            </div>
          </li>
        <li className="d-flex insta_icon">
          <div>
            <InstagramIcon className="mr-1 "/><a href="/"></a>
            </div>
         

          </li>
          <li className="d-flex">
            <HomeIcon className="mr-1"/>
            <a href="/"id=" light" className="home">Home</a>

          </li>

          <li className=" d-flex">
            <AddBoxOutlinedIcon
              className="add_icon"
              fontSize="medium"
              onClick={() => setOpenDialog(true)}
            />

            <p  onClick={() => setOpenDialog(true)} 
            className="create"
            >
              Create
            </p>
          </li>
          <li className="d-flex Switch_Appearance">
            
            <p className="mr-1"id="dark light">Switch Appearance</p>
            <div className="switch pr-3 d-flex">
           
            <ReactSwitch
            className="mt-2 mr-1"
            width={23}
            height={12}
            onChange={toggleTheme}
            checked ={theme ==="dark"}
            />
             {theme === 'dark' ? <DarkModeIcon /> : <LightModeOutlinedIcon /> }

          
            </div>

         

          </li>
          

         
          <li onClick={logOut} className="d-flex">
          <AccountCircleRoundedIcon className="mr-2"/>

          <p>Log In</p>

            
          </li>
         
        </ul>
      </nav>
      <Menu >
        <MenuElement>
          {" "}
          <a href="/">Settings</a>
        </MenuElement>
        <MenuElement>
          {" "}
          <a href="/">Saved</a>
        </MenuElement>{" "}
        <MenuElement>
          {" "}
          <a href="/">Switch appearance</a>
        </MenuElement>{" "}
        <MenuElement>
          {" "}
          <a href="/">Report a problem</a>
        </MenuElement>{" "}
        <MenuElement>
          {" "}
          <a href="/">Switch accounts</a>
        </MenuElement>
        <MenuElement onClick={logOut}> Log out</MenuElement>
      </Menu>




    
    </Container>
  );
}
const Container = styled.div`
background-color: blue;



`;
const CreatePostForm = styled.div`
  display: flex;
  width: 100%;

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const InputContainer = styled.div`
  width: 90%;
  height: 33px;
  margin-bottom: 20px;

  input {
    width: 100%;
    height: 45px;
    border: 1px solid lightgray;
    padding: 5px;
    outline: none;
  }
  
  textarea {
    width: 100%;
    height: 200px;
    resize: none;
    border: 1px solid lightgray;
    padding: 5px;
    margin-top: 25px;
    outline: none;
  }
`;
const PostCTAButtons = styled.div`
width: 100%;
display: flex;
button {
margin-left:5px;
border-radius: 5px;
width:170px;
height: 35px;
border: none;
cursor: pointer;
}
.cancel-button {
  background-color: red;
  color: white;

}
.post-button {
  background-color: #026aab;
  color: white;
}
@media only screen and (max-width: 660px) {
  .cancel-button {
   margin-left:-365px;
   width:120px;
  
  }
  .post-button {
   width:120px;

  }
  }

`;
const Menu = styled.div`
  display: ${(props) => (props.openMenu ? "block" : "none")};
`;
const MenuElement = styled.div`
`;

export default NavigationBar;
