import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UserIcon from '../components/userIcon.jsx';
import { useNavigate, NavLink } from 'react-router-dom';
import { removeRequest } from '../utils/removeRequest.js';
import { followback } from '../utils/friendSystem.js';
import Profile from '../components/suggestionProfile.jsx';

const FriendRequest = ({ followerInfo, followers, setFollowers, setTotalFollowers, setUnreadNotifs }) => {
  const { username, _id, requestId, read } = followerInfo;
  const { user } = useSelector(state => state.user);
  const nav = useNavigate();

  const removeReq = async (e) => {
    e.stopPropagation();
    try {
      const options = {
        _id: requestId
      }
      const res = await removeRequest(options);
      const remainingFollowers = followers.filter(follower => follower.requestId !== requestId);
      setFollowers(remainingFollowers);
      setTotalFollowers(prev => prev - 1)
    } catch (e) {
      console.log(e)
    }
  }
  console.log(followerInfo)


  const handleReadRequest = async () => {
    try {
      const senderId = _id;
      const recipientId = user?._id;
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/read-notif`, {
        senderId,
        recipientId
      })
      setUnreadNotifs(prev => {
        return { ...prev, request: prev.request === 0 ? 0 : prev.request - 1 }
      });
    } catch (e) {
      console.log("handleReadRequest", e)
    }
  }
  const handleFollowback = async (e) => {
    e.stopPropagation();
    try {
      const res = await followback({ userOne: user._id, userTwo: _id });
      const remainingFollowers = followers.filter(follower => follower.requestId !== requestId);
      setFollowers(remainingFollowers);
      setTotalFollowers(prev => prev - 1)
    } catch (e) {
      console.log("followback", e)
    }
  }

  return <NavLink onClick={handleReadRequest} to={`/user/${_id}/?data=posts`}>
    <div className={`w-full p-4 ${read ? "bg-neutral-50" : "bg-gradient-to-l from-blue-100 to-neutral-50"} rounded`}>
      <div className='flex gap-2 w-full'>
        <UserIcon info={followerInfo} />
        <div className='flex flex-col w-full'>
          <p className='font-bold'>{username}</p>
          <div className=' flex gap-2 '>
            <button onClick={removeReq} className='bg-neutral-200/50 rounded-lg p-2 w-full '>Remove</button>
            <button onClick={handleFollowback} className='bg-blue-400 text-white rounded-lg p-2 w-full'>Follow back</button>
          </div>
        </div>
      </div>
    </div>
  </NavLink>
}


const FriendRequestList = ({ setUnreadNotifs }) => {
  const { user, authenticated } = useSelector(state => state.user);
  const [followers, setFollowers] = useState([])
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [newFriends, setNewFriends] = useState([]);
  const [isServerSideOK, setIsServerSideOK] = useState(false);

  const getFriendRequests = async () => {
    if (!authenticated) return;
    try {
      const userInterests = JSON.stringify(user.interests);
      const [requests, peopleYMK] = await Promise.all([axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-friend-request/recipient=${user._id}`), axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-non-followers/${user._id}`, {
        params: {
          userInterests,
          country: user.country
        }
      })])


      setFollowers(requests.data.followerInfos)
      setTotalFollowers(requests.data.totalFollowers)
      setNewFriends(requests.data.newFriendInfos);
      setPeopleYouMayKnow(peopleYMK.data.peopleYouMayKnow);
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

  const removeNewFriendNotif = async (friendshipId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/view-friendship/${friendshipId}`);
      console.log("removeNewFriendNotif", res)
    } catch (e) {
      console.log("removeNewFriendNotif", e)
    }
  }

  return <div>
    <div>
      {
        newFriends.length > 0 && <div>
          {
            newFriends.map((friend) => <NavLink onClick={() => removeNewFriendNotif(friend.friendshipId)} to={`/user/${friend._id}/?data=posts`} className='flex bg-blue-100 p-1 items-center gap-2'>
              <UserIcon info={friend} />
              <div className='flex flex-col gap-1'>
                <p>{friend?.nickname || friend.username}</p>
                <p className='opacity-50 text-xs'>New friend</p>
              </div>
            </NavLink>)
          }
        </div>
      }
    </div>
    <p className='text-xl ml-2 my-2 font-bold'> Followers</p>
    <div>
      {
        followers.length > 0 && followers.map((follower) => <FriendRequest setUnreadNotifs={setUnreadNotifs} setTotalFollowers={setTotalFollowers} setFollowers={setFollowers} followers={followers} followerInfo={follower} />)
      }
    </div>
    <p className='text-xl ml-2 my-2 font-bold'>People with shared interests</p>
    <div>
      {
        peopleYouMayKnow.length > 0 && peopleYouMayKnow.map((person) => <Profile key={person._id} info={person} />)
      }
    </div>
  </div>

}

export default FriendRequestList