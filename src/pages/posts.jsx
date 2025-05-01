import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Post from '../components/post.jsx';
import axios from 'axios';

const Posts = () => {
  const { user, authenticated } = useSelector(state => state.user);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState([]);
  const {userId} = useParams();
  const getPosts = async(page) => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-posts-of-user/${userId}/${page}`);
        console.log(res)
        setPosts(prev => prev.length === 0 && page === 0 ? res.data.posts : [...prev, ...res.data.posts]);
      }catch(e){
        console.log(e)
      }
    }
  
  useEffect(() => {
    const handlePagination = () => {
      if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 80)) {
        setPage(prev => prev + 1 );
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
    posts.length > 0 ? posts.map((post) => <Post postInfo = {post} />) : <p className = 'w-full text-center my-4 text-neutral-400'>No posts yet</p>
  }
</div>

}

export default Posts