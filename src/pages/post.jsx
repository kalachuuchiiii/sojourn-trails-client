import axios from 'axios';
import { useState, useEffect, useRef } from 'react' 
import { getOneCommentById, getCommentsOfAuthor } from '../utils/getComment.js';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux'; 
import { useParams } from 'react-router-dom';
import Post from '../components/post.jsx';
import { GoPaperAirplane } from "react-icons/go";
import PopUp from '../components/popUp.jsx';
import Comments from '../components/comments.jsx';
import NAPopUp from '../components/notAuthorizedPopup.jsx';

const PostPage = () => {
  const { postId } = useParams();
  const { authenticated, user} = useSelector(state => state.user);
  const [postInfo, setPostInfo] = useState(null);
  const [highlightedComment, setHighlightedComment] = useState(null); 
  const [authorComments, setAuthorComments] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [commentForm, setCommentForm] = useState({
    toPost: postId,
    text: {
      mention: null, 
      message: '',
      receiverId: null
    },
    author: authenticated ? user._id : null,
    replyTo: null,
    isTargetPostHasComments: postInfo?.hasComments || false
  })
  const textareaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stopPagination, setStopPagination] = useState(false);
  const [commentPage, setCommentPage] = useState(0);
  const [isCommentFetchingPending, setIsCommentFetchingPending] = useState(false);
  const [isProhibited, setIsProhibited] = useState(false);
  const params = new URLSearchParams(window.location.search); 
  const highlight = params.get("highlight"); 
  const highlightId = params.get("_id");
  
  const handleChange = (e) => {
    const { name, value } = e.target; 
    if(value.length >= 100){
      return;
    }
    setCommentForm(prev => {
      
      return {...prev, [name]: {
        ...prev[name],
        message: value
      }}
    })
  }
  
  const getComments = async(authorId, page) => {
    if(totalComments !== 0 && totalComments === comments.length){
      setStopPagination(true);
      return;
    }
    setIsCommentFetchingPending(true);
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-comments-of-post/exclude-from=${authorId}/post=${postId}/page=${page}/comment=${highlightId}/reply=${null}`); 
        setIsCommentFetchingPending(false);
        return {
          totalComments: res.data.totalComments, 
          comments: res.data.comments
        }
        
        
      }catch(e){
        console.log(e)
        throw new Error(e.message);
      }
    }
  
  
  const postComment = async(e) => {
    e.preventDefault(); 
    
    if(!authenticated){
      setIsProhibited(true);
      return;
    }
    setIsLoading(true);
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/post-comment`, {
        ...commentForm, receiverId: postInfo.postOf
      })
      console.log('comment',res)
      setIsLoading(false);
      setCommentForm(prev => {
        return {
          ...prev, text: {
            message: ''
          }
        }
      })
      const { postOf, text, author, replyTo } = commentForm;
      setComments(prev => [ res.data.postCom, ...prev])
    }catch(e){
      console.log(e)
      setIsLoading(false);
    }
    
  }
  
  const getRequiredData = async() => {
    setIsCommentFetchingPending(true);
    try{
      const authorId = postInfo.postOf;
      const [highlightedComment, commentsOfAuthor, regularComments] = await Promise.all([
       (highlight === "comment" && highlightId) ? getOneCommentById(highlightId) : null,
        getCommentsOfAuthor(postInfo._id, authorId),
        getComments(postInfo.postOf, 0),
      ])
      
     setHighlightedComment(highlightedComment); 
     setAuthorComments(commentsOfAuthor);
     setComments(regularComments.comments);
     setTotalComments(regularComments.totalComments)
     setIsCommentFetchingPending(false)
    }catch(e){
      console.log(e)
    }
    
  }
  
  useEffect(() => {
      if(postInfo !== null ){
        
        getRequiredData();
      }
  }, [postInfo]); 
  
  useEffect(() => {
    if(stopPagination)return;
    
    const totalFetchedData = (comments.length + authorComments.length) + (highlightedComment !== null ? 1 : 0)
    console.log(totalFetchedData, totalComments)
    
    if((totalFetchedData === totalComments) && totalComments !== 0){
      setStopPagination(true); 
      return;
    }
    if( commentPage !== 0 && comments.length > 0){
      getComments(null, commentPage);
    }
  }, [commentPage])
  
  useEffect(() => {
    const textarea = textareaRef.current 
    if(!textarea)return; 
    textarea.style.height = "auto"; 
    const totalTextareaHeight = textarea.scrollHeight
    textarea.style.height = `${totalTextareaHeight}px`
  }, [commentForm.text])
  
  
  
  useEffect(() => {
    const getPostInfo = async() => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-post/${postId}`); 
        
        setPostInfo(res.data.post);
      }catch(e){
        console.log(e)
      }
    }
    getPostInfo()
    
  }, [postId]); 
  
  useEffect(() => {
    const handlePagination = () => {
      if((window.innerHeight+window.scrollY) >= (document.body.scrollHeight - 50)){
        setCommentPage(prev => prev + 1);
      }
    }
    
    window.addEventListener('scroll', handlePagination)
    
    return() => {
      window.removeEventListener('scroll', handlePagination)
    }
    
  }, [])
  

if(!postInfo){
  return <div className = 'w-full text-center my-10 text-neutral-400'>Loading...</div>
}

return <div className = 'w-full flex flex-col md:grid md:grid-cols-2  gap-2'>
  <AnimatePresence>
      {
    isProhibited && <NAPopUp onClose = {() => setIsProhibited(false)}/>
  }
  </AnimatePresence>
  {
    isLoading && <PopUp />
  }
  <div className = 'w-full'>
      <Post postInfo = {postInfo}/> 
  <form onSubmit = {postComment} className = 'w-full flex outline rounded-lg mt-1 items-center justify-center'>
    <textarea ref = {textareaRef} onChange = {handleChange} rows = "1" name = "text" value = {commentForm.text.message} className = 'p-2  w-full outline-none' placeholder = "Share your thoughts here..." />
    <button disabled = {commentForm.text.message?.length >= 100 || commentForm.text.message?.length === 0 || isLoading} type = "submit" className = 'p-2 flex items-center justify-center'>
          <GoPaperAirplane/>
    </button>
  </form>
  <p className = ' my-4 md:my-8 text-center text-neutral-400'>We'd love to hear your thoughts—drop a comment below and share your experience with us!</p>
  </div>
  <div >
    {
     ( (comments.length > 0) || (highlightedComment) || (authorComments.length > 0)) &&     <Comments authorComments = {authorComments} highlightedComment = {highlightedComment} postAuthor = {postInfo.postOf} setIsProhibited = {setIsProhibited} comments = {comments} />
    }
        </div>
    <div className = 'text-xs text-neutral-400 w-full text-center mb-10 '>
          {
      isCommentFetchingPending ? <p>Loading...</p> : stopPagination && <p>No more comments to show</p>
    }
  </div>
</div>

}

export default PostPage