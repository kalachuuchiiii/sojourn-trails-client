import { useSelector } from 'react-redux'; 
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import UserIcon from '../components/userIcon.jsx';
import axios from "axios";
import { removeRequest } from '../utils/removeRequest.js';

const SentRequestsPage = () => {
  const [sentRequests, setSentRequests] = useState([]); 
  const { user: { _id }, authenticated } = useSelector(state => state.user); 
  
  const getSentRequests = async() => {
    try{
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-sent-requests`, {
            params: {
              userId: _id
            }
          })
          console.log(res);
          setSentRequests(res.data.sentRequests);
        }catch(e){
          console.log("getSentRequests", e)
        }
  }
  
  const handleUnfollow = async(recipientId) => {
    try{
          const options = {
            sender: _id, 
            recipient: recipientId
          }
          const res = await removeRequest(options)
       const remainingSentRequests = sentRequests.filter((user) => user._id !== recipientId); 
       setSentRequests(remainingSentRequests);
        }catch(e){
          console.log("unf", e)
        }
  }
  
  useEffect(() => {
    getSentRequests();
  }, [_id])
  const html = "<p>Hahaha</p>"
  

return <div className = ' w-full'>
    <p className='text-xl ml-2 mb-2 w-full text-left font-bold'>Sent Requests</p> 
    <div className = 'flex flex-col gap-2'>
      {
        sentRequests?.length > 0 && sentRequests.map((request) => <div className = 'flex gap-1'>
<UserIcon info = {request} /> 
<div className = 'flex justify-between items-center w-full '>
  <NavLink className = 'font-bold active:underline' to = {`/user/${request._id}/?data=posts`}>{request?.nickname || request?.username}</NavLink>
  {html}
  <button onClick = {() => handleUnfollow(request._id)} className='bg-gradient-to-l from-blue-400 to-blue-300 p-2 text-white rounded-lg'>Unfollow</button>
</div>
        </div>)
      }
    </div>
</div>

}

export default SentRequestsPage