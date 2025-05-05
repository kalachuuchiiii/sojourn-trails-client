import { useSelector } from 'react-redux'
import { NavLink, useParams, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Post from '../components/post.jsx';
import axios from 'axios';
import Posts from '../pages/posts.jsx' 
import Favorites from '../pages/dreamList.jsx';

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [dreamList, setDreamList] = useState([]);
  const [page, setPage] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, authenticated, isDoneSessionLooking } = useSelector(state => state.user);
  const { userId } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const data = searchParams.get("data");
  
  
  const pages = [
    {to: `/user/${userId}/?data=posts`,
    text: 'Posts'
  }, {
    to: `/user/${userId}/?data=favorites`, 
    text: 'Favorites'
  }]
  
  useEffect(() => {
    setIsLoading(true);
    const getUserInfo = async() => {
      
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-by-id/${userId}`);
        setUserInfo(res.data.userInfo)
        setIsLoading(false);
      }catch(e){
        console.log(e)
      }
    }
    getUserInfo();
  }, [userId])
  
  if(!authenticated && isDoneSessionLooking){
    window.location.href = `${import.meta.env.VITE_HOMEPAGE}/login`;
  }
  
  if(isLoading || !userInfo){
    return <div className = 'w-full h-full flex justify-center items-center'>
      <p className = 'text-neutral-400 text-sm'>Loading...</p>
    </div>
  }
  
  
  

return <div className = 'w-full'>
  <div className = 'w-full flex flex-col items-center justify-center'>
    <div className = 'flex items-center justify-center rounded-full size-38 bg-white'>
          <div className = 'size-36 rounded-full overflow-hidden'>
          <img src = {userInfo.icon} />
    </div>
    </div>
    <div className = ' my-4 rounded p-2 w-full bg-neutral-50'>
          <div className = ' text-center'>
          <p className = 'text-2xl  font-bold'>{userInfo.nickname || userInfo.username}</p>
    <p className = 'text-sm my-2'>{userInfo.bio && userInfo.bio}</p>
    </div>
    <div className = 'w-full'>
      {
        authenticated && user._id === userInfo._id? <button className = 'p-2 w-6/12 rounded-lg text-white bg-gradient-to-l from-blue-400 to-blue-300'>Edit profile</button> :       <button className = 'p-2 w-6/12 rounded-lg text-white bg-gradient-to-l from-blue-400 to-blue-300'>Add friend</button>
      }
      <button className = 'p-2 w-6/12 rounded-lg bg-neutral-100 text-gray-800'>Message</button>
    </div>
    </div>
  </div>
  <div className = 'flex bg-neutral-50 w-full  rounded  my-2 justify-center h-10 items-center '>
    {
      pages.map(page => <NavLink to = {page.to} className = {`w-6/12  p-2  text-center  ${page.text.toLowerCase() == data && ' border border-transparent border-b-2 border-b-blue-400'}`}>{page.text}</NavLink>)
    }
  </div>
  {
    data === 'posts' ? <Posts /> : <Favorites />
  }
</div>

}

export default Profile