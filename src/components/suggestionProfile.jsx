import UserIcon from './userIcon.jsx';
import { NavLink } from 'react-router-dom';
import { follow } from '../utils/friendSystem.js';
import { removeRequest } from '../utils/removeRequest.js';
import { useState } from 'react';
import { useSelector } from 'react-redux';
const Profile = ({ info }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const { user: { _id } } = useSelector(state => state.user);

  const handleFollowUser = async () => {
    const sender = _id;
    const recipient = info._id;
    try {

      const res = await follow({ sender, recipient })
      setIsFollowed(true)
    } catch (e) {
      console.log("handleFollowUser", e)
    }
  }
  
  const handleUnfollowUser = async() => {
    try{
      const options = {
        recipient: info._id,
        sender: _id
      }
          const res = await removeRequest(options)
       console.log("unfo", res)
       setIsFollowed(false)
        }catch(e){
          console.log("unfolloe", e)
        }
  }
  

  return <div className='flex w-full gap-2 p-2 bg-neutral-50 rounded '>
    <UserIcon info={info} />
    <div className='flex w-full items-center justify-between gap-2'>
      <NavLink className='active:underline' to={`/user/${info._id}/?data=posts`}>{info?.nickname || info.username}</NavLink>
      <button onClick={isFollowed ? handleUnfollowUser : handleFollowUser} className='bg-gradient-to-l from-blue-400 to-blue-300 p-2 text-white rounded-lg'>{isFollowed ? "Unfollow" : "Follow"}</button>
    </div>
  </div>

}

export default Profile