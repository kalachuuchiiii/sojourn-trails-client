import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { savePosts } from '../state/postsSlice.jsx';
import Community from '../components/community.jsx';
import NewPost from '../components/newPost.jsx';
import axios from 'axios';
import Communities from '../components/communities.jsx';
import Placeholder from '../components/placeholder.jsx';
import NAPopUp from '../components/notAuthorizedPopup.jsx';
import Post from '../components/post.jsx';


const Homepage = ({ isSessionLookingDone }) => {
  const { user, authenticated } = useSelector(state => state.user);
  const { savedPosts, currentPage } = useSelector(state => state.posts);
  const dispatch = useDispatch();
  
  const [posts, setPosts] = useState(savedPosts || []);
  const [page, setPage] = useState(currentPage || 0);
  const [stopPagination, setStopPagination] = useState(false);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [pageLimit, setPageLimit] = useState(0);
  const [isPostFetchingLoading, setIsPostFetchingLoading] = useState(false);
  const nav = useNavigate();
  

  const getPosts = async (page) => {
    if(totalPostCount !== 0 && totalPostCount <= posts.length){
      setStopPagination(true); 
      return 
    }
    try {
      setIsPostFetchingLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-posts/${page}`)
      if(res){
        if(res.data.totalPosts === 0){
        setStopPagination(true); 
        return;
      }
      setTotalPostCount(res.data.totalPosts)
      
      setPosts(prev => prev.length > 0 ? [...prev, ...res.data.allPosts] : res.data.allPosts);
      setIsPostFetchingLoading(false);
      }
    } catch (e) {
      console.log('posterror', e)
    }
  }



  useEffect(() => {
    
    if (authenticated && page === 0 && !stopPagination && savedPosts?.length === 0) {
      getPosts(0);
    }
  }, [authenticated, nav, savedPosts])

  useEffect(() => {
    if (!isPostFetchingLoading && authenticated && page !== 0 && !stopPagination) {
      getPosts(page);
    }
  }, [page])

  useEffect(() => {
    
    const handlePagination = () => {
      if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50)) {
        setPage(prev => prev + 1);
      }
    }
    
  
    const handleScroll = () => {
      localStorage.setItem('home_scroll', `${window.scrollY}`);
      console.log(window.scrollY)
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handlePagination);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener("scroll", handlePagination);
      window.scrollTo(0,0);
      dispatch(savePosts({posts, currentPage: page}));
    };

}, []);

useEffect(() => {
  setTimeout(() => {
    const saved = localStorage.getItem('home_scroll');
    if (saved !== null) {
      window.scrollTo(0, parseInt(saved, 10));
      
    }
  }, 500)
}, [])

    


  if (!isSessionLookingDone ) {
    return <Placeholder />
  }

  if (isSessionLookingDone && !authenticated) {
    return <NAPopUp />
  }
  
  if(isSessionLookingDone && authenticated && !user?.hasFinishedOnboarding){
    nav("/customize-feed")
  }
  
  return <div className=" flex flex-col md:flex-row md:flex-row-reverse w-full h-screen p-2">
    <Communities />
    <div className='w-full'>
      <NewPost />
      <div className='flex flex-col w-full mb-6 gap-6'>
        {
          posts?.length > 0 && posts.map((post) => <Post key = {post._id} postInfo={post} />
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