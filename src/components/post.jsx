import axios from 'axios';
import UserIcon from './userIcon.jsx';
import{ useEffect, useState } from 'react';
import Slider from './slider.jsx';
import { CiHeart } from "react-icons/ci";
import { IoHeartDislikeOutline } from "react-icons/io5";
import { FaRegComments } from "react-icons/fa";

const Post = ({postInfo = {}}) => {
  const [authorInfo, setAuthorInfo] = useState(null)
  
  const { postOf, fileUrls, postDesc } = postInfo; 
  
  useEffect(() => {
    const getAuthor = async() => {
      
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${postOf}`); 
        console.log(res)
        setAuthorInfo(res.data.userInfo);
      }catch(e){
        console.log(e)
      }
    }
    getAuthor();
  }, [postOf]); 
  
  if(!authorInfo){
    return <div className = 'w-full h-60 rounded-lg bg-neutral-100 flex animate-pulse items-center justify-center'>
    
    </div>
  }
  

return <div className = 'flex outline p-2 rounded-lg gap-2 flex-col w-full'>
  {
    authorInfo && <UserIcon info = {authorInfo} />
  }
  <p className = 'pl-2'>{postDesc}</p>
  
{
  fileUrls.length > 0 &&   <div>
    <hr className = 'my-2'/>
    <Slider files = {fileUrls} />
  </div>
}
<div className = 'w-full mt-2 flex gap-1 justify-evenly text-xs  items-center'>
  <button className = 'w-full flex gap-1 items-center bg-neutral-100 p-2 rounded '>
    <CiHeart size = "22" color = "red" /> <p>Like</p>
  </button>
  <button className = 'w-full gap-1 p-2 flex items-center rounded bg-neutral-100'>
    <IoHeartDislikeOutline size = "22"/> <p>Dislike</p>
  </button>
  <button className = 'w-full gap-1 p-2 flex items-center rounded bg-neutral-100'>
    <FaRegComments size = "22"/>
    <p >Comment</p>
  </button>
</div>
</div>

}

export default Post