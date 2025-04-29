import axios from 'axios';
import UserIcon from './userIcon.jsx';
import{ useEffect, useState } from 'react';
import Slider from './slider.jsx';
import StarRating from './starRating.jsx';
import { FaRegComments, FaHeart, FaRegHeart } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Post = ({postInfo = {}}) => {
    let { postOf, fileUrls, rate, likes, postDesc, _id } = postInfo; 
  const [authorInfo, setAuthorInfo] = useState(null); 
  const [cpyLikes, setCpyLikes] = useState(likes);
  
  const { user, authenticated } = useSelector(state => state.user);
  const [isLiked, setIsLiked] = useState(false);
  
  
  useEffect(() => {
    const getAuthor = async() => {
      
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${postOf}`); 
        
        setAuthorInfo(res.data.userInfo);
      }catch(e){
        console.log(e)
      }
    }
    getAuthor();
  }, [postOf]); 
  
  useEffect(() => {
    setIsLiked(cpyLikes.some(liker => liker === user?._id));
  }, [likes])
  
  const likePost = async() => {
    if(!authenticated){
      return;
    }
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/like/${_id}`, {
        likerId: user?._id
      }); 
      setCpyLikes(prev => [...prev, user._id])
      setIsLiked(true);
    }catch(e){
      console.log(e)
    }
  }
  
  const dislikePost = async() => {
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/dislike/${_id}`, {
        likerId: user?._id
      })
      
      setCpyLikes(prev => [...prev].filter(liker => liker !== user._id));
      setIsLiked(false);
    }catch(e){
      console.log(e)
    }
  }
  
  if(!authorInfo){
    return <div className = 'w-full h-60 rounded-lg bg-neutral-100 flex animate-pulse items-center justify-center'>
    
    </div>
  }
  

return <div className = 'flex outline p-2 rounded-lg gap-2 flex-col w-full'>
  {
    authorInfo && <div>
      <UserIcon info = {authorInfo} />
      <div className = 'p-2 my-1 bg-neutral-100 rounded-lg'>
        <p className = 'text-xs'>{authorInfo._id === user._id ? `You rated this place ${rate || 1} stars` : `The author rated this place ${rate || 1} stars`}</p>
              <StarRating rate = {rate }/>
      </div>
    </div>
  }
  <NavLink to = {`/post/${_id}`} className = 'my-2'>
    <p className = 'text-neutral-400 text-xs'>Post Description</p>
      <p className = 'pl-2 text-sm'>{postDesc}</p>
  </NavLink>
  
{
  fileUrls.length > 0 &&   <div>
    <hr className = 'my-2'/>
    <Slider files = {fileUrls} />
  </div>
}
<p className = 'w-full text-xs text-neutral-400 h-4'>{cpyLikes.length > 0 ? cpyLikes.length : 'No likes yet'} </p>
<div className = 'w-full  flex gap-1 justify-evenly text-xs  items-center'>
  <button onClick = {isLiked ? dislikePost : likePost } className = 'w-full flex gap-1 items-center text-red-400 bg-neutral-100 p-2 rounded '>
    {
      isLiked ? <FaHeart size = "24" /> : <FaRegHeart size = "24"/>
    }
    <p>{isLiked ? 'Liked' : 'Like'}</p>
  </button>
  <button className = 'w-full gap-1 p-2 flex items-center rounded bg-neutral-100'>
    <FaRegComments size = "22"/>
    <NavLink to = {`/post/${_id}`} >Comment</NavLink>
  </button>
</div>
</div>

}

export default Post