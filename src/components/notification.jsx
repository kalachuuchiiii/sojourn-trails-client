import axios from 'axios'; 
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserIcon from '../components/userIcon.jsx';
import { FaHeart, FaRegComments } from "react-icons/fa";
import { months } from './comment.jsx';

const Notification = ({info = null}) => {
const [receiverInfo, setReceiverInfo] = useState(null); 
const [sendersName, setSendersName] = useState("");
const [sendersInfo, setsendersInfo] = useState(null);
const getReceiverInfo = async(userId) => {
    try{
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${userId}`); 
        return res.data.userInfo;
    }catch(e){
      console.log(e)
    }
  }
  
useEffect(() => {
  
   const getReceiverAndSendersInfo = async() => {
      
      setReceiverInfo(await getReceiverInfo(info.recepient))
      setsendersInfo(await getReceiverInfo(info.senders[info.senders.length-1])); 
     }
    if(info){
      getReceiverAndSendersInfo();
    }
  
}, [info])

useEffect(() => {
  if(sendersInfo){
    setSendersName(info.senders.length > 1 ? `${sendersInfo?.nickname || sendersInfo.username} and ${info.senders.length - 1} others` : sendersInfo?.nickname || sendersInfo.username)
  }
}, [sendersInfo])


const [ year, month, day ] = info.createdAt.split("T")[0].split("-").map(Number);

const icon = (info.message === "Liked your post" || info.message === "Liked your comment") ?       <FaHeart className = "text-red-400" size = "24"/> : <FaRegComments className = "text-neutral-500" size = "24" />

const url = info.message === "Liked your post" ? `/post/${info.parentPostId}` : info.message === "Commented on your post" || info.message === "Liked your comment" ? `/post/${info.parentPostId}/?highlight=comment&_id=${info.targetId}` : (info.message === "Liked your reply" || info.message === "Replied to your comment") && `/comment/${info.targetId}/reply/${info.replyId}`;


return <NavLink to = {url}  className = 'flex flex-col rounded p-2 active:bg-neutral-200 transition-colors duration-200 bg-white'><div className = ' w-full flex items-center justify-between '>
  <div className = 'flex items-center gap-1'>
    <UserIcon info = {receiverInfo}/>
    <div className = 'grid gap-0 w-full'>
      <NavLink to = {info.senders.length === 1 && `/user/${info.senders[0]}/?data=posts`} className = ' active:underline z-20 font-bold '>{sendersName}</NavLink>
      <p className = 'text-neutral-700 text-sm'>{info.message}</p>
    </div>

  </div>
<div className = 'p-2 rounded-full bg-neutral-100 '>
  { 
  icon
  }
</div>
</div>
<div className = 'text-xs text-neutral-400'>
  {`${months[month -1]} ${day}, ${year}`}
</div>
</NavLink>

}

export default Notification