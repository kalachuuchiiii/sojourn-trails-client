import { useState, useEffect } from 'react';
import UserIcon from '../components/userIcon.jsx';
import axios from 'axios';
import { useSelector } from 'react-redux';


const Comment = ({info}) => {
  const [authorInfo, setAuthorInfo] = useState(null)
  const [replies, setReplies] = useState(false);
  
  useEffect(() => {
    const getAuthorInfo = async() => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${info?.author || info?.commentOf}`); 
        console.log(res)
        setAuthorInfo(res.data.userInfo);
      }catch(e){
        console.log('author', e)
      }
    }
    if(info){
      getAuthorInfo();
    }
  }, [info])
  
return <div className = 'p-1 bg-neutral-100 rounded-lg'>
  
  <div className = ' p-2 rounded-lg bg-white'>
    <UserIcon info = {authorInfo}/>
      <p>{info.text}</p>
  </div>
  <div className = 'flex gap-4 p-1'>
    <button>Like</button>
    <button>Reply</button>
  </div>
  {
    info?.hasReplies && <button>See Replies</button>
  }
</div>

}

export default Comment