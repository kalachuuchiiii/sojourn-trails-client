import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UserIcon from '../components/userIcon.jsx';
import { removeRequest } from '../utils/removeRequest.js';
import { followback } from '../utils/friendSystem.js';

const FriendRequest = ({ followerInfo, followers, setFollowers, setTotalFollowers }) => {
  const { username, _id, requestId } = followerInfo;
  const { user } = useSelector(state => state.user);

  const removeReq = async () => {
    try {
      const options = {
        _id: requestId
      }
      const res = await removeRequest(options);
      const remainingFollowers = followers.filter(follower => follower.requestId !== requestId);
      setFollowers(remainingFollowers);
      setTotalFollowers(prev => prev - 1)
      console.log(res);
    } catch (e) {
      console.log(e)
    }
  }
  
  const handleFollowback = async() => {
    try{
          const res = await followback({userOne: user._id, userTwo: _id}); 
          const remainingFollowers = followers.filter(follower => follower.requestId !== requestId);
          setFollowers(remainingFollowers);
      setTotalFollowers(prev => prev - 1)
        }catch(e){
          console.log("followback", e)
        }
  }

  return <div className='w-full p-4 bg-neutral-50 rounded '>
    <div className='flex gap-2 w-full'>
      <UserIcon info={followerInfo} />
      <div className='flex flex-col w-full'>
        <p>{username}</p>
        <div className=' flex gap-2 '>
          <button onClick={removeReq} className='bg-neutral-200/50 rounded-lg p-2 w-full '>Remove</button>
          <button onClick = {handleFollowback} className='bg-blue-400 text-white rounded-lg p-2 w-full'>Follow back</button>
        </div>
      </div>
    </div>
  </div>
}


const FriendRequestList = () => {
  const { user, authenticated } = useSelector(state => state.user);
  const [followers, setFollowers] = useState([])
  const [strangers, setStrangers] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [isServerSideOK, setIsServerSideOK] = useState(false);
  const getFriendRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-friend-request/recipient=${user._id}`);
      console.log("requests", res)
      setFollowers(res.data.followerInfos)
      setTotalFollowers(res.data.totalFollowers)
      setIsServerSideOK(true);
    } catch (e) {
      console.log("friend", e)
    }
  }

  useEffect(() => {
    if (authenticated) {
      getFriendRequests();
    }
  }, [user, authenticated])

  if (!isServerSideOK) {
    return <div></div>
  }

  return <div>
    <div></div>
    <p className='text-xl ml-2 mb-2 font-bold'>{totalFollowers !== 0 ? totalFollowers : null} Followers</p>
    <div>
      {
        followers.length > 0 && followers.map((follower) => <FriendRequest setTotalFollowers={setTotalFollowers} setFollowers={setFollowers} followers={followers} followerInfo={follower} />)
      }
    </div>
  </div>

}

export default FriendRequestList