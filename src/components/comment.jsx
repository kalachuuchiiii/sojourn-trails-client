import { useState, useEffect } from 'react';
import UserIcon from '../components/userIcon.jsx';
import Comments from './comments.jsx'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GoPaperAirplane } from "react-icons/go";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import PopUp from './popUp.jsx';

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const Form = ({toPost, authorName, closeReply, targetComment,  isTargetCommentHasReplies, setReplies, setCommentInfo, receiverId}) => {
  const { user } = useSelector(state => state.user);
  
  const [replyForm, setReplyForm] = useState({
    text: {
      message: '', 
      mention: `@${authorName}`,
      receiverId
    },
    toPost, 
    replyTo: targetComment,
    author: user._id, 
    isTargetCommentHasReplies
  })
  const [isPostingReply, setIsPostingReply] = useState(false);
  
  const handlePostReply = async(e) => {
    e.preventDefault();
    setIsPostingReply(true);
    
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/post-reply`, {
        ...replyForm
      })
      setCommentInfo(prev => {
        return {
          ...prev, hasReplies: true
        }
      })
      setReplyForm(prev => {
        return {
          ...prev, text: ''
        }
      })
      setReplies(prev => [res.data.newRep, ...prev])
      closeReply();
      setIsPostingReply(false);
    }catch(e){
      setIsPostingReply(false);
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target; 
    if(value.length === 0 || value.length >= 100)return;
    setReplyForm(prev => {
      return {...prev, [name]: {
        ...prev[name],
        message: value
      }}
    })
  }
  
  
  
 return <form onSubmit = {handlePostReply} className = 'w-full outline p-2 rounded-lg flex gap-2'>
   {
     isPostingReply && <PopUp/>
   }
    <input onChange = {handleChange} value = {replyForm.text.message} name = "text"className = 'w-full outline-none'/>
    <button disabled = {isPostingReply} type = "submit">
      <GoPaperAirplane/>
    </button>
  </form>
}

const Comment = ({info, postAuthor, replyingTo, setReplyingTo, setIsProhibited}) => {
  const { user, authenticated } = useSelector(state => state.user);
  const [authorInfo, setAuthorInfo] = useState(null)
  const [replies, setReplies] = useState([]);
  const [commentInfo, setCommentInfo] = useState(info)
  const [isViewReplies, setIsViewReplies] = useState(false);
  const [replyPage, setReplyPage] = useState(0);
  const [isGetReplyPending, setIsGetReplyPending] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const highlightedCommentId = searchParams.get("_id")
  
  
  const handleGetReplies = async() => {
    setIsGetReplyPending(true);
    setIsViewReplies(true);
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-replies-of-comment/${commentInfo._id}`, {
        params: {
          page: replyPage, 
          toPost: commentInfo.toPost
        }
        
      }); 
      setReplies(res.data.replies)
      setIsGetReplyPending(false);
      
    }catch(e){
      
      setIsGetReplyPending(false);
    }
  }
  
  
  
  useEffect(() => {
    const getAuthorInfo = async() => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${commentInfo?.author || commentInfo?.commentOf}`); 
        
        setAuthorInfo(res.data.userInfo);
      }catch(e){
        console.log('author', e)
      }
    }
    if(commentInfo){
      getAuthorInfo();
    }
  }, [commentInfo])
  
  const handleLike = async() => {
    if(!authenticated){
      setIsProhibited(true); 
      return;
    }
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/like-comment`, {
        userId: user._id, 
        commentId: commentInfo._id
      }); 
      
      setCommentInfo(prev => {
        return {
          ...prev, likes: [...prev.likes, user._id ]
        }
      })
    }catch(e){
      console.log(e)
    }
  }
  const handleDislike = async() => {
    if(!authenticated){
      setIsProhibited(true); 
      return;
    }
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/dislike-comment`, {
        userId: user._id, 
        commentId: commentInfo._id
      }); 
      const likesExcludedUser = commentInfo.likes.filter(liker => liker !== user._id); 
      setCommentInfo(prev => {
        return {
          ...prev, likes: likesExcludedUser
        }
      })
    }catch(e){
      console.log(e)
    }
  }
  
  const [year, month, day] = commentInfo?.createdAt.split('T')[0].split("-").map(Number);
  
  
  if(!authorInfo){
    return <div></div>
  }
  
return <div className = {`p-2 rounded-lg ${highlightedCommentId === info._id ? " bg-neutral-200/50" : " bg-neutral-50"}`}>
  
  <div className = ' p-2  rounded-r-lg '>
    <div className = 'flex gap-2'>
          <UserIcon info = {authorInfo}/>
          <div className = 'flex flex-col gap-0 justify-center text-xs'>
            <div className = 'flex items-center gap-2'>
                          <NavLink to = {`/user/${authorInfo._id}/?data=posts`} className = 'font-bold'>{authorInfo?.nickname || authorInfo?.username || '...'}</NavLink>
                          {
                           authorInfo._id === postAuthor && <div className = 'p-1 text-xs bg-neutral-100 rounded'>Author</div>
                          }
            </div>
            <p className = 'text-neutral-400'>{`Posted on ${months[month-1]} ${day}, ${year}`}</p>
          </div>
    </div>
    <div>
      <p>{
       commentInfo.text.mention && <NavLink to = {`/user/${commentInfo.text.receiverId}/?data=posts`} className = 'text-blue-400 inline'>{commentInfo.text.mention}</NavLink>
      } {commentInfo.text.message}</p>
    </div>
  </div>
  <div className = 'flex  text-sm  gap-6 '>
    <button onClick = {commentInfo.likes.includes(user._id) ? handleDislike : handleLike} className = ' flex gap-1 p-2 text-red-400 items-center'>{
      commentInfo.likes.includes(user._id) ? <FaHeart  size = "20" /> : <FaRegHeart size = "20"/>
    }{commentInfo.likes.length !== 0 && commentInfo.likes.length}</button>
    <button onClick = {!authenticated ? () => setIsProhibited(true): () => setReplyingTo(prev => prev === commentInfo._id ? null : commentInfo._id)}>{replyingTo === commentInfo._id ? <p className = 'text-neutral-400 p-2'>Cancel Reply</p> : 'Reply'}</button>
  </div>
  <div>
      {
    replyingTo === commentInfo._id && <Form receiverId = {commentInfo.author} authorName = {authorInfo?.username} closeReply = {() => setReplyingTo(null)} setCommentInfo = {setCommentInfo} isTargetCommentHasReplies = {commentInfo.hasReplies} targetComment = {commentInfo._id} toPost = {commentInfo.toPost} setReplies = {setReplies}/>
  }
  </div>
  <div>
      {
    commentInfo?.hasReplies && <button onClick = {isViewReplies ? () => setIsViewReplies(false) : handleGetReplies} className = 'text-sm ml-4 text-neutral-400'>{isViewReplies ? 'Hide Replies' : 'View Replies'}</button>
  }
  </div>
  <div>
      {
    isGetReplyPending ? <p className = 'text-xs text-neutral-400'>Loading replies...</p> : replies.length > 0 && isViewReplies && <div className = 'w-full ml-2'>
      <Comments setIsProhibited = {setIsProhibited} comments = {replies}/>
    </div>
  }
  </div>
</div>

}

export default Comment