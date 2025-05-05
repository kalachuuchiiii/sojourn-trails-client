import axios from 'axios'; 
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserIcon from '../components/userIcon.jsx';
import { FaHeart } from "react-icons/fa";
import { months } from './comment.jsx';

const Notification = ({info = null}) => {
const [receiverInfo, setReceiverInfo] = useState(null); 
const [actorInfo, setActorInfo] = useState(null);

console.log(actorInfo)

const getReceiverInfo = async(userId) => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${userId}`); 
        return res.data.userInfo;
    }catch(e){
      console.log(e)
    }
  }
  
useEffect(() => {
  
   const getReceiverAndActorInfo = async() => {
      
      setReceiverInfo(await getReceiverInfo(info.receiverId))
     setActorInfo(await getReceiverInfo(info.actor))
    }
    if(info){
      getReceiverAndActorInfo();
    }
  
}, [info])


if(!receiverInfo || !actorInfo || !info){
  return <div>Loading...</div>
}

const [ year, month, day ] = info.createdAt.split("T")[0].split("-").map(Number);

return <NavLink to = {info.url} className = 'flex flex-col rounded p-2 active:bg-neutral-200 transition-colors duration-200 bg-white'><div className = ' w-full flex items-center justify-between '>
  <div className = 'flex items-center gap-1'>
    <UserIcon info = {receiverInfo}/>
    <div className = 'grid gap-0 w-full'>
      <NavLink to = {`/user/${actorInfo._id}/?data=posts`} className = ' active:underline z-20 font-bold '>{actorInfo.username}</NavLink>
      <p className = 'text-neutral-700 text-sm'>{info.message}</p>
    </div>

  </div>
<div className = 'p-2 text-red-400 rounded-full bg-neutral-100 '>
      <FaHeart size = "24"/>
</div>
</div>
<div className = 'text-xs text-neutral-400'>
  {`${months[month -1]} ${day}, ${year}`}
</div>
</NavLink>

}

export default Notification