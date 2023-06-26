import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import MapsUgcRoundedIcon from '@mui/icons-material/MapsUgcRounded';
import { useStateValue } from '../stateprovider';
import {  addDoc, collection, doc, getDoc,  onSnapshot,  orderBy,  query,  serverTimestamp,  setDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { ThemeContext } from '../App';


function Post({  
  username,
  photoURL,
  caption,
  imageURL,
  postID
}) {

  const { theme, toggleTheme } = useContext(ThemeContext);

const [{user}] = useStateValue();
const [openDialog, setOpenDialog] = useState(false);
const [moreButton, setMoreButton] = useState(false);
const [likesOnPost, setLikesOnPost] = useState({
  likes:[]
})
const [likeState, setLikeState] = useState({
  like:likesOnPost?.likes.length > 0 ? likesOnPost?.likes.length : 0,
  likeActive:false,
  likes:likesOnPost?.likes
});




const [commentInput, setCommentInput] = useState("");
const [userComments, setUserComments] = useState([])
const [commentState, setCommentState] = useState({
  comments:userComments?.length > 0 ? userComments?.length : 0,
})


  async function handleComment(e) {
    e.preventDefault();
    if (user) {

      if (commentInput.length > 0) {
        let payload = {
          commentInput,
          username: user?.username,
          photoURL: user?.photoURL,
          timeStamp: serverTimestamp(),
        };
        const docRef = doc(db, "comments", postID);
        await addDoc(collection(docRef, 'list'), payload);
        setCommentInput("");
      }
    } else {
      alert("Please login to post a comment");
    }
  }

    const handleLike = async (e)=> {
      e.preventDefault();
      if(user) {
      if(likesOnPost?.likes.includes(user?.username)) {
        // dislike part
        const likePayload = {
          likes: likesOnPost?.likes.filter((likedUser) => {
            return likedUser !=  user?.username;
         
        }) 
          
        } 
        await setDoc(doc(db,'likes', postID), likePayload);
        setLikesOnPost({
          likes:likePayload.likes,
        })
      } else {
        // like part
        const likePayload = {
          likes: [...likesOnPost.likes, user?.username], 
        };
        setLikesOnPost(likePayload);
        await setDoc(doc(db,'likes', postID), likePayload);
        setLikesOnPost({
          likes: likePayload.likes,
        });
      }
    } else {
      alert("Please login to like post");
    }
    };



const getLikes = async() => {

  const docRef = doc(db, 'likes', postID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    setLikesOnPost(docSnap.data());
} 
setLikeState({
  like: docSnap.data()?.likes?.length ? docSnap.data()?.likes?.length : 0,
  likeActive: docSnap.data()?.likes?.includes(user?.username) ? true : false,
})
};
useEffect (()=> {
  getLikes();
}, [likeState])

const getComments = async () => {
  const q = query(collection(db, 'comments',postID, 'list'),orderBy('timeStamp','desc'))
  onSnapshot(q, (snapshot)=> {
    setUserComments(snapshot.docs);
    setCommentState({
      comments: snapshot.docs.length,
    })
  })
}
useEffect (()=> {
  getComments();
}, [commentState]);




  return (
    <Container>
      <div className='dialog' id='dark'>

        
      <Dialog 
      open = {openDialog} 
      onClose={()=> setOpenDialog(false)}
      maxWidth="sm"
      fullWidth
      >
        <DialogTitle
          id={theme}
        
        >
          Comments
        </DialogTitle>
        
        <DialogContent
          id={theme}
        
        >
          <AllCommentsContainer 
          >
            {
             userComments.map((comment, index) => (
              <div className='post-comment d-flex comments' >
                <div className='user-img'>
                  
                  <img key={index} src={comment.data().photoURL} alt=''/>
                </div>
                <div className='user-comment d-flex '>
                  <strong key={index} className='mr-2 '>
                    {comment?.data().username}
                  </strong>
                  <p >
                    {comment.data().commentInput}
                  </p>
              
                </div>
                
              </div>
             ))
            }
          </AllCommentsContainer>
        </DialogContent>
      </Dialog>
      </div>


      <UserInfo>
        <img src={photoURL}/>
        <p className=''>{username}</p>
      </UserInfo>

      <Content>
        <img src={imageURL}/>
      </Content>

      <PostCTA className='d-flex '>
        <Heart className=' d-flex'  >
       {
        
        likeState.likeActive === true ? (
          <img src="./redheart.jpg"
          onClick={handleLike}
          className='mr-4 ' 
          
          />
        ): (
            <FavoriteBorderOutlinedIcon 
          onClick={handleLike}
          className='mr-3' 
          />

          
        )
       }
        <MapsUgcRoundedIcon onClick={()=> setOpenDialog(true)}/>
        <SendOutlinedIcon className='ml-4 '/>
        </Heart>
        <BookmarkBorderOutlinedIcon className='bookmark '/>
      </PostCTA>
      <LikeCount className='d-flex'><div className='mr-1'>{likesOnPost?.likes.length}</div>Likes</LikeCount>
      <PostDiscription 
      moreButton={moreButton}
      >
        <h5>{caption} </h5>
        <div className='recent-comment'>
        <div className='d-flex '>
          <strong className='mr-2'>{userComments[0]?.data().username}</strong>
          <p>{userComments[0]?.data().commentInput}</p>
        </div>
        </div>
        <div className='discription-button d-flex'>
          <p onClick={() => setOpenDialog(true)}>View all comments</p>
         
          <p onClick={()=> setMoreButton(!moreButton)}>{moreButton ? "Less": "More" }</p>
        </div>
      </PostDiscription>
      <CommentInput>
        <input 
        type='text'
        placeholder="Add a comment..." 
        onChange={(e) => setCommentInput(e.target.value)}
        value={commentInput}
     />
        <button className='post_button'>
          <SentimentSatisfiedAltIcon 
        onClick={handleComment}
          className='smily-face'/>
       
        </button>
      </CommentInput>


    </Container>
  )
}
const Container = styled.div`

p {
  color:black;

}
height: fit-content;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
width: 700px;


`;
const Content = styled.div`
display: flex;
justify-content: center;
align-items: center;


img {
  width: 500px;
  margin: 20px 0;
  border-radius: 5px;
}
@media only screen and (max-width: 530px) {
  
  img {
    width: 340px;
    margin-right: 160px;
  }
  }
`;
const PostCTA = styled.div`
width:500px;
transition: all 0.5s ease-in-out;


img {
  height: 20px;
}
.bookmark {
  margin-left: 367px;
}

`;
const UserInfo = styled.div`

height:42px;
margin: 10px 0;
width: 72%;
display: flex;
align-items: left;

img {
  width: 38px;
  height: 38px;
  border-radius: 100%;
  margin-left: 10px;
  margin-top: 2px;
  border: 1px solid lightgray;


}
p {
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  margin-left: 10px;
margin-top: 10px;
}
`;
const LikeCount = styled.div`
width: 70%;
font-weight:500;



`
const PostDiscription = styled.div`
width: 100%;
width: 70%;
cursor: pointer;

h5 {
width: 100%;
overflow-y:hidden;
text-overflow: ellipsis;
word-break: break-all;
font-size: 14px;
line-height: 20px;
font-weight: 500;
min-height: 35px;
height: ${(props)=> props.moreButton ? 'fit-content' : "37px"};

}

.discription-button {
  font-size: 14px;
  display:flex;
  justify-content: space-between;
  margin-top:10px;
  margin-bottom: 10px;
  color: greay;
  height: 100px;


}
@media only screen and (max-width: 660px) {
  .discription-button {
width:330px;
}
}
.recent-comment {
  font-size: 12px;
}
.comment {
  height: 22px;
}
`
const CommentInput = styled.div`

width: 72%;
padding: 10px 0;

input {
  border:none;
  margin-right: 292px;
outline: none;

}
@media only screen and (max-width: 530px) {
input {
  margin-right: 130px;
}
}



border-bottom: 1px solid lightgray;
.post_button {
  border:none;
outline: none;
background-color: var(--body_background);

}
.smily-face {
  width: 15px;
background-color:  var(--body_background);
color: var(--body_color);


  
}

`
const Heart = styled.div`
cursor: pointer;
margin-top:-2px;

.redheart1 {
}
`
const AllCommentsContainer = styled.div`


.post-comment: {
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;

  img {
  
    width: 35px;
    height: 35px;
    border-radius: 50%;

  
  }

  }

}
.user_img {
  width: 30px;
  height: 30px;
  border-radius:12px;
  margin-right: 10px;
}
`


export default Post;