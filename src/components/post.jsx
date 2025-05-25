import axios from 'axios';
import UserIcon from './userIcon.jsx';
import{ useEffect, useState, useRef } from 'react';
import Slider from './slider.jsx';
import StarRating from './starRating.jsx';
import { FaRegComments, FaHeart, FaRegHeart } from "react-icons/fa";
import { months } from './comment.jsx';
import { AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { viewLikers } from '../state/likersSlice.js';
import NAPopUp from '../components/notAuthorizedPopup.jsx'
import PostSettings from '../components/postSettings.jsx';
import { BsThreeDotsVertical } from "react-icons/bs";

const Post = ({postInfo = { postOf: null, fileUrls: [], rate: 0, likes: 0, postDesc: "", _id:null}}) => {
    let { postOf, fileUrls, rate, likes, postDesc, _id } = postInfo
    
  const [authorInfo, setAuthorInfo] = useState(null); 
  
  const [cpyLikes, setCpyLikes] = useState(likes);
  const [isPostSettingOpen, setIsPostSettingOpen] = useState(false);
  const [isServerBusy, setIsServerBusy] = useState(false);
  const { user, authenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [isProhibited, setIsProhibited] = useState(false);
  
  useEffect(() => {
    const getAuthor = async() => {
      
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${postOf}`); 
        
        if(res){
          setAuthorInfo(res.data.userInfo);
        }
      }catch(e){
        
      }
    }
    getAuthor();
  }, [postOf]); 
  
  useEffect(() => {
    setIsLiked(cpyLikes.some(liker => liker === user?._id));
  }, [likes])
  
  
  const likePost = async() => {
    if(!authenticated || isLiked){
      setIsProhibited(true);
      return;
    }
    setIsServerBusy(true);
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/like/${_id}`, {
        likerId: user?._id,
        recipient: authorInfo?._id
      }); 
      
      
      if(res){
        setCpyLikes(prev => [...prev, user?._id])
      setIsLiked(true);
      setIsServerBusy(false);
      }
      
    }catch(e){
      console.log(e)
    }
  }
  
  const handleViewLikers = (e) => {
    e.stopPropagation()
      const likerIds = [...cpyLikes]
      dispatch(viewLikers({likerIds}))
      console.log("oat")
    }
  
  const dislikePost = async() => {
    if(!authenticated || !isLiked){
      setIsProhibited(true); 
      return;
    }
    try{
      setIsServerBusy(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/dislike/${_id}`, {
        likerId: user?._id,
        recipient: authorInfo?._id
      })
  
      
      setCpyLikes(prev => [...prev].filter(liker => liker !== user._id));
      setIsLiked(false);
      setIsServerBusy(false)
    }catch(e){
      console.log(e)
    }
  }
  
  
  if(!authorInfo || !_id ){
    return <div className = 'w-12/12 h-60 md:h-80 lg:h-100 rounded-lg bg-neutral-100 flex animate-pulse items-center justify-center'>
    
    </div>
  }
  
  const [ year, month, day ] = authorInfo?.createdAt.split("T")[0].split("-").map(Number)
  
  

return <div className = 'flex bg-neutral-50 p-1 rounded-lg gap-2 flex-col w-full'>
    <AnimatePresence>
      {
    isProhibited ? <NAPopUp onClose = {() => setIsProhibited(false)}/> : isPostSettingOpen && <PostSettings postLink = {`/post/${_id}`} postAuthorId = {authorInfo?._id} postId = {_id} onClose = {() => setIsPostSettingOpen(false)}/>
  }
  </AnimatePresence>
  {
    authorInfo && <div>
      <div className = "flex justify-between items-center">
              <div className = 'flex  rounded gap-2 w-full items-center'>
              <UserIcon info = {authorInfo} />
              <div className = 'flex text-sm flex-col gap-0'>
                <NavLink to = {`/user/${authorInfo?._id}/?data=posts`} className = 'font-bold'>
                  {authorInfo?.nickname || authorInfo?.username || '...'}
                </NavLink>
                <p className = 'text-xs text-neutral-400'>
                  {
                    `Posted on ${months[month -1]} ${day}, ${year}`
                  }
                </p>
              </div>
      </div>
      <button onClick = {() => setIsPostSettingOpen(prev => !prev)} className = "p-2">
              <BsThreeDotsVertical/>
      </button>
      </div>
      <div className = 'p-2 my-1 bg-neutral-100 rounded-lg'>
        <p className = 'text-xs'>{authorInfo?._id === user?._id ? `You rated this place ${rate || 1} stars` : `The author rated this place ${rate || 1} stars`}</p>
              <StarRating rate = {rate }/>
      </div>
    </div>
  }
  <NavLink to = {`/post/${_id}`} className = 'my-2'>
    <p className = 'text-neutral-400 text-xs'>Post Description</p>
      <p className = 'pl-2 text-sm'>{postDesc}</p>
  </NavLink> 
  <div>
    {
  fileUrls.length > 0 &&   <div>
    <hr className = 'my-2'/>
    <Slider files = {fileUrls} />
  </div>
}
  </div>
<div className = 'w-full  flex gap-1 justify-evenly text-xs  items-center'>
  <button disabled = {isServerBusy}  onClick = {isLiked ? dislikePost : likePost } className = 'w-full flex gap-3 items-center text-sm bg-white text-red-400  p-2 rounded '>
    {
      isLiked ? <FaHeart size = "24" /> : <FaRegHeart size = "24"/>
    }
    <button className = 'active:underline text-base' onClick = {handleViewLikers}>{cpyLikes.length !== 0 && cpyLikes.length}</button>
  </button>
  <button className = 'w-full gap-1 p-2 flex items-center rounded bg-white'>
    <FaRegComments className = "text-neutral-500" size = "22"/>
    <NavLink to = {`/post/${_id}`} >Comment</NavLink>
  </button>
</div>
</div>

}

export default Post