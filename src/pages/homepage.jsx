import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Community from '../components/community.jsx';
import NewPost from '../components/newPost.jsx';
import axios from 'axios';
import Communities from '../components/communities.jsx';
import Placeholder from '../components/placeholder.jsx';
import NAPopUp from '../components/notAuthorizedPopup.jsx';
import Post from '../components/post.jsx';


const Homepage = ({ isSessionLookingDone }) => {
  const { user, authenticated } = useSelector(state => state.user);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [stopPagination, setStopPagination] = useState(false);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [isPostFetchingLoading, setIsPostFetchingLoading] = useState(false);
  const nav = useNavigate();

  const getPosts = async (page) => {
    if(stopPagination )return; 
    if(totalPostCount !== 0 && totalPostCount <= posts.length){
      setStopPagination(true); 
      return 
    }
    try {
      setIsPostFetchingLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-posts/${page}`)
      setTotalPostCount(res.data.totalPosts)
      setPosts(prev => prev.length > 0 ? [...prev, ...res.data.allPosts] : res.data.allPosts);
      setIsPostFetchingLoading(false);
    } catch (e) {
      console.log('posts', e)
    }
  }


  useEffect(() => {
    if (authenticated && page === 0) {
      getPosts(page);
    }
  }, [nav])

  useEffect(() => {
    if (!isPostFetchingLoading && authenticated && page !== 0 && !stopPagination) {
      getPosts(page);
    }
  }, [page])

  useEffect(() => {
    const handlePagination = () => {
      if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50)) {
        setPage(prev => prev + 1 );
      }
    }
    
    window.addEventListener("scroll", handlePagination); 
    return()=>{
      window.removeEventListener("scroll", handlePagination)
    }

  }, [])


  if (!isSessionLookingDone && !authenticated) {
    return <Placeholder />
  }

  if (isSessionLookingDone && !authenticated) {
    return <NAPopUp />
  }
  return <div className=" flex flex-col md:flex-row md:flex-row-reverse w-full h-screen p-2">
    <Communities />
    <div className='w-full'>
      <NewPost />
      <div className='flex flex-col w-full mb-6 gap-6'>
        {
          posts.length > 0 && posts.map((post) => <Post key = {post._id} postInfo={post} />
          )
        }
        <div className = 'text-center text-sm text-neutral-400'>
                  {
         stopPagination ? <p>No more posts to show</p> : isPostFetchingLoading && <p>Loading...</p>
        }
        </div>
      </div>
    </div>
  </div>
}

export default Homepage