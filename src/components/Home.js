import React, { useEffect, useState } from "react";


import {  db } from "./Firebase";
import "./Post";


import NavigationBar from "./NavigationBar";
import Post from "./Post";
import { useStateValue } from "../stateprovider";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import styled from "styled-components";

function Home() {
  const [{ user }] = useStateValue();
  const [allposts, setAllposts] = useState([]);



  


useEffect (() => {
const fetchposts = () => {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snapshot) => {
    setAllposts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, })));
  })
}
fetchposts();
},[]
);



  return (
    <Container className="home">
      <NavigationBar />
      <Inner>
        <Main>
          <PostContainer>
            {allposts.map((post)=> (
               <Post 
               
               key={post.id}
               
               username = {post.username}
               photoURL = {post.photoURL}
               caption = {post.caption}
               imageURL = {post.imageURL}
               postID = {post.id}
               />
            ))}
 
          </PostContainer>
        </Main>
      </Inner>

    </Container>
  );
}
const Container = styled.div`
overflow:hidden;


`;
const PostContainer = styled.div`
margin-top: 40px;
display: flex;
flex-wrap: wrap;
justify-content: center;
flex-direction: column;
align-items: center;
@media only screen and (max-width: 660px) {
margin-left: -75px;
transition: all 0.3s ease-in-out;

}




`;
const Inner = styled.div`



`;
const Main = styled.div`


`;

export default Home;
