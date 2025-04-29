import axios from 'axios';
import { useState, useEffect, useRef } from 'react' 
import { useSelector } from 'react-redux'; 
import { useParams } from 'react-router-dom';
import Post from '../components/post.jsx';
import { GoPaperAirplane } from "react-icons/go";
import PopUp from '../components/popUp.jsx';
import Comments from '../components/comments.jsx';

const PostPage = () => {
  const { postId } = useParams();
  const { authenticated, user} = useSelector(state => state.user);
  const [postInfo, setPostInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    toPost: postId,
    text: '',
    author: authenticated ? user._id : null,
    replyTo: null,
    isTargetPostHasComments: postInfo?.hasComments || false
  })
  const textareaRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commentPage, setCommentPage] = useState(0);
  
  const handleChange = (e) => {
    const { name, value } = e.target; 
    if(value.length >= 100){
      return;
    }
    setCommentForm(prev => {
      return {...prev, [name]: value}
    })
  }
  
  
  const postComment = async(e) => {
    e.preventDefault(); 
    setIsLoading(true);
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/post-comment`, {
        ...commentForm
      })
      
      setIsLoading(false);
      setCommentForm(prev => {
        return {
          ...prev, text: ''
        }
      })
      const { postOf, text, author, replyTo } = commentForm;
      setComments(prev => [ res.data.postCom, ...prev])
    }catch(e){
      console.log(e)
      setIsLoading(false);
    }
    
  }
  
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
    getPostInfo();
    
  }, [postId]); 
  
  useEffect(() => {
    const getCommentsById = async() => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-comments-of-post/${postInfo._id}/${commentPage}`); 
        setComments(prev => [...prev, ...res.data.comments]);
        
        
      }catch(e){
        
      }
    }
    if(authenticated && postInfo && commentPage === 0){
      getCommentsById();
    }
  }, [postInfo]); 
  
  useEffect(() => {
    const handlePagination = () => {
      if((window.innerHeight+window.scrollY) === (document.body.scrollHeight - 100)){
        setCommentPage(prev => prev + 1);
      }
    }
    
    window.addEventListener('scroll', handlePagination)
    console.log(commentPage);
    return() => {
      window.removeEventListener('scroll', handlePagination)
    }
    
  }, [])
  

if(!postInfo){
  return <div>Loading...</div>
}

return <div className = 'w-full grid gap-2'>
  {
    isLoading && <PopUp />
  }
  <Post postInfo = {postInfo}/> 
  <form onSubmit = {postComment} className = 'w-full flex outline rounded-lg items-center justify-between'>
    <textarea ref = {textareaRef} onChange = {handleChange} rows = "1" name = "text" value = {commentForm.text} className = 'p-2  w-full' placeholder = "Write your thoughts" />
    <button disabled = {commentForm.text.length >= 100 || commentForm.text.length === 0 || isLoading} type = "submit" className = 'p-2 flex items-center justify-center'>
          <GoPaperAirplane/>
    </button>
  </form>
  <div>
    {
     ( comments && comments.length > 0 ) &&     <Comments comments = {comments} />
    }
  </div>
</div>

}

export default PostPage