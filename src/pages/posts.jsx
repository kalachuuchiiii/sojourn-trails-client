import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Post from '../components/post.jsx';
import axios from 'axios';

const Posts = () => {
  const { user, authenticated } = useSelector(state => state.user);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const [stopPagination, setStopPagination] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const {userId} = useParams();
  const [maxPage, setMaxPage] = useState(0);
  const limit = 10;
  console.log(page, maxPage)
  
  const getPosts = async(page) => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-posts-of-user/${userId}/${page}`);
        console.log("posts",res)
        setPosts(prev => prev.length === 0 && page === 0 ? res.data.posts : [...prev, ...res.data.posts]);
        setTotalPosts(res.data.totalPosts);
        setMaxPage(Math.ceil(posts.length/10))
      }catch(e){
        console.log(e)
      }
    }
  
  useEffect(() => {
    const handlePagination = () => {
          if(page === maxPage){
      setStopPagination(true)
      return;
    }
      if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 80)) {
        setPage(prev => prev === maxPage ? prev : prev + 1);
      }
    }
    window.addEventListener("scroll", handlePagination); 
    return()=>{
      window.removeEventListener("scroll", handlePagination)
    }
  }, []); 
  
  useEffect(() => {
    
    if(page === 0 && posts.length === 0){
      getPosts(0);
    }
  }, [userId]);
  
  useEffect(() => {
    if(page !== 0 && posts.length > 0){
      getPosts(page);
    }
  }, [page])

return <div className = 'mb-10'>
  {
    posts.length > 0 ? posts.map((post) => <Post postInfo = {post} />) : stopPagination ? <p>No more post to show</p> : <p className = 'w-full text-center my-4 text-neutral-400'>No posts yet</p>
  }
</div>

}

export default Posts