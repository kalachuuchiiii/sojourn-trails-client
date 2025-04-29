import { useState, useEffect } from 'react';
import UserIcon from '../components/userIcon.jsx';
import Comments from './comments.jsx'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { GoPaperAirplane } from "react-icons/go";
import PopUp from './popUp.jsx';

const Form = ({toPost, closeReply, targetComment,  isTargetCommentHasReplies, setCommentInfo}) => {
  const { user } = useSelector(state => state.user);
  
  const [replyForm, setReplyForm] = useState({
    text: '',
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
      console.log(res)
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
      closeReply();
      setIsPostingReply(false);
    }catch(e){
      console.log(e) 
      setIsPostingReply(false);
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target; 
    if(value.length === 0 || value.length >= 100)return;
    setReplyForm(prev => {
      return {...prev, [name] : value}
    })
  }
  
 return <form onSubmit = {handlePostReply} className = 'w-full outline p-2 rounded-lg flex gap-2'>
   {
     isPostingReply && <PopUp/>
   }
    <input onChange = {handleChange} value = {replyForm.text} name = "text"className = 'w-full outline-none'/>
    <button disabled = {isPostingReply} type = "submit">
      <GoPaperAirplane/>
    </button>
  </form>
}

const Comment = ({info, replyingTo, setReplyingTo}) => {
  const [authorInfo, setAuthorInfo] = useState(null)
  const [replies, setReplies] = useState([]);
  const [commentInfo, setCommentInfo] = useState(info)
  const [isViewReplies, setIsViewReplies] = useState(false);
  const [replyPage, setReplyPage] = useState(0);
  const [isGetReplyPending, setIsGetReplyPending] = useState(false);
  
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
      console.log(res)
    }catch(e){
      console.log('replies', e)
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
  
  
  
return <div className = 'p-1 bg-neutral-100 rounded-lg'>
  
  <div className = ' p-2 rounded-lg bg-white'>
    <UserIcon info = {authorInfo}/>
      <p>{commentInfo.text}</p>
  </div>
  <div className = 'flex text-sm gap-4 p-1'>
    <button>Like</button>
    <button onClick = {() => setReplyingTo(prev => prev === commentInfo._id ? null : commentInfo._id)}>{replyingTo === commentInfo._id ? <p className = 'text-neutral-400'>Cancel Reply</p> : 'Reply'}</button>
  </div>
  <div>
      {
    replyingTo === commentInfo._id && <Form closeReply = {() => setReplyingTo(null)} setCommentInfo = {setCommentInfo} isTargetCommentHasReplies = {commentInfo.hasReplies} targetComment = {commentInfo._id} toPost = {commentInfo.toPost}/>
  }
  </div>
  <div>
      {
    commentInfo?.hasReplies && <button onClick = {isViewReplies ? () => setIsViewReplies(false) : handleGetReplies} className = 'text-sm ml-4 text-neutral-400'>{isViewReplies ? 'Hide Replies' : 'View Replies'}</button>
  }
  </div>
  <div>
      {
    isGetReplyPending ? <p>Loading replies...</p> : replies.length > 0 && isViewReplies && <div className = 'w-full ml-2'>
      <Comments comments = {replies}/>
    </div>
  }
  </div>
</div>

}

export default Comment