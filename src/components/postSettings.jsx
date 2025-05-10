import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { fromBottom, fade } from '../motionVariants/variant.js';
import axios from 'axios';
import { useEffect } from 'react';
const PostSettings = ({postLink, onClose, postAuthorId, postId}) => {
  
  const { user: {_id}} = useSelector(state => state.user);
  
  const settings = [
    {
      text: "Add to favorites"
    },{
      text: "Share Link"
    }
    ]
    
    useEffect(() => {
      document.documentElement.style.overflow = "hidden" 
      return() => {
        document.documentElement.style.overflow = "" 
      }
    }, [])
    
    const deletePost = async() => {
      try{
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/delete-post-by-id/postId=${postId}`); 
        if(res.data.success){
          window.location.reload();
        }
      }catch(e){
        console.log(e)
      }
    }

return <motion.div
variants = {fade} 
initial = "hidden"
animate = "visible" 
exit = "hidden"
onClick = {onClose}
className = 'fixed inset-0 z-50 bg-black/50  flex flex-col justify-end'>
  <motion.div
  variants = {fromBottom}
  >
      <div onClick = {e => e.stopPropagation()} className = 'bg-neutral-100 flex flex-col justify-between p-2 rounded-t-xl'>
    <h1 className = 'w-full text-center text-xl my-4 font-bold'>What would you like to do?</h1>
    <div className = "text-lg py-5">
          <div className = 'flex flex-col gap-4'>
      {
        settings.map(({text}) => <button >
          {text}
        </button>)
      }
      {
        _id === postAuthorId && <div className = 'flex flex-col gap-4'>
          <button>Turn off notification for this post</button>
          <button onClick = {deletePost} className = "text-red-500">Delete</button>
        </div>
      }
    </div>
    </div>
  </div>
  </motion.div>
</motion.div>

}

export default PostSettings