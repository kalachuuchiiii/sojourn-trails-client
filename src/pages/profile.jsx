import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useParams, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Post from '../components/post.jsx';
import axios from 'axios';
import Posts from '../pages/posts.jsx'
import Favorites from '../pages/dreamList.jsx';
import { addFriend, unfriend, followback } from '../utils/friendSystem.js';
import { AnimatePresence } from 'framer-motion';
import { getUserInfo } from '../utils/getUserInfo.js'
import { MoonLoader } from 'react-spinners';
import UnfriendModal from '../modals/unfriendOptionModal.jsx';
import { removeRequest } from '../utils/removeRequest.js';
import { newSentRequest } from '../state/userSlice.js';


const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [dreamList, setDreamList] = useState([]);
  const [page, setPage] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [isServerSideOK, setIsServerSideOK] = useState(false);
  const [
    relationshipStatus, setRelationshipStatus] = useState("");
  const { user, authenticated, isDoneSessionLooking } = useSelector(state => state.user);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isOperationPending, setIsOperationPending] = useState(false);
  const { userId } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const data = searchParams.get("data");
  const dispatch = useDispatch();

  const pages = [
    {
      to: `/user/${userId}/?data=posts`,
      text: 'Posts'
    }, {
      to: `/user/${userId}/?data=favorites`,
      text: 'Favorites'
    }]

  const getRelationshipStatus = async () => {
    if (user._id === userId) {
      return "user"
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-relationship`, {
        params: {
          userId: user._id,
          otherUserId: userId
        }
      })

      return res.data.relationshipStatus;
    } catch (e) {
      console.log("stat", e)
      throw new Error(e);
    }
  }

  const sendFriendRequest = async () => {
    try {
      setIsOperationPending(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/send-friend-request`, {
        recipient: userId,
        sender: user._id
      })
      if (res) {
        setRelationshipStatus(res.data.status);
        setIsOperationPending(false)
      }
    } catch (e) {
      console.log("request", e)

    }
  }

  const handleFollowback = async () => {
    setIsOperationPending(true)
    try {
      const res = await followback({ userOne: user._id, userTwo: userId });
      if (res) {
        setRelationshipStatus(res.data.status)
        setIsOperationPending(false)
      }
    } catch (e) {
      console.log("handlefollowback", e)
    }
  }

  const getServerSideProps = async () => {
    try {

      const [userInfo, status] = await Promise.all([
        getUserInfo(userId),
        getRelationshipStatus()
      ])
      setRelationshipStatus(status);
      setUserInfo(userInfo)
      setIsServerSideOK(true);
      setIsLoading(false);
    } catch (e) {
      console.log(e)
    }
  }

  const handleOpenOptions = () => {
    setIsOptionsOpen(prev => !prev);
  }

  const cancelRequest = async () => {
    setIsOperationPending(true)
    try {
      const options = {
        sender: user._id,
        recipient: userId
      }
      const res = await removeRequest(options);
      if (res) {
        setRelationshipStatus(res.data.status);
        setIsOperationPending(false)
      }
    } catch (e) {
      console.log("cancel", e)
    }
  }


  useEffect(() => {
    setIsLoading(true);
    if (authenticated) {
      getServerSideProps();
    }
  }, [userId, authenticated])


  const btnStyle = "p-2 w-full rounded-lg bg-gradient-to-l text-white flex items-center justify-center h-10 from-blue-400 to-blue-300 text-gray-800"

  const buttons = {
    friend: <button disabled={isOperationPending} onClick={handleOpenOptions} className={btnStyle}  >{isOperationPending ? <MoonLoader size="20" color="white" /> : "Friends"}</button>,
    follower: <button disabled={isOperationPending} onClick={handleFollowback} className={btnStyle}>{isOperationPending ? <MoonLoader size="20" color="white" /> : "Follow Back"}</button>,
    following: <button disabled={isOperationPending} onClick={cancelRequest} className={btnStyle}>{isOperationPending ? <MoonLoader size="20" color="white" /> : "Unfollow"}</button>,
    user: <button className={btnStyle}>Edit Profile</button>,
    default: <button disabled={isOperationPending} onClick={sendFriendRequest} className={btnStyle}>{isOperationPending ? <MoonLoader size="20" color="white" /> : "Follow"}</button>
  }

  if (!authenticated && isDoneSessionLooking) {
    window.location.href = `${import.meta.env.VITE_HOMEPAGE}/login`;
  }

  if (isLoading || !userInfo || !isServerSideOK) {
    return <div className='w-full h-full flex justify-center items-center'>
      <p className='text-neutral-400 text-sm'>Loading...</p>
    </div>
  }




  return <div className='w-full'>
    <AnimatePresence>
      {
        isOptionsOpen && <UnfriendModal userOne={user._id} userTwo={userId} setRelationshipStatus={setRelationshipStatus} onClose={() => setIsOptionsOpen(false)} />
      }
    </AnimatePresence>
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='flex items-center justify-center rounded-full size-38 bg-white'>
        <div className='size-36 rounded-full overflow-hidden'>
          <img src={userInfo.icon} />
        </div>
      </div>
      <div className=' my-4 rounded p-2 w-full bg-neutral-50'>
        <div className=' text-center'>
          <p className='text-2xl  font-bold'>{userInfo.nickname || userInfo.username}</p>
          <p className='text-sm my-2'>{userInfo.bio && userInfo.bio}</p>
        </div>
        <div className='w-full flex gap-1 justify-center'>
          {
            buttons[relationshipStatus]
          }

          <button className='p-2 w-full rounded-lg bg-neutral-100 text-gray-800'>Message</button>
        </div>
      </div>
    </div>
    <div className='flex bg-neutral-50 w-full  rounded  my-2 justify-center h-10 items-center '>
      {
        pages.map(page => <NavLink to={page.to} className={`w-6/12  p-2  text-center  ${page.text.toLowerCase() == data && ' border border-transparent border-b-2 border-b-blue-400'}`}>{page.text}</NavLink>)
      }
    </div>
    {
      data === 'posts' ? <Posts /> : <Favorites />
    }
  </div>

}

export default Profile