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
  const nav = useNavigate();

  const getPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-posts/${page}`)
      console.log(res)
      setPosts(res.data.allPosts);
    } catch (e) {
      console.log('posts', e)
    }
  }


  useEffect(() => {
    if(authenticated){
      getPosts();
    }
  }, [nav])


  if (!isSessionLookingDone && !authenticated) {
    return <Placeholder />
  }

  if (isSessionLookingDone && !authenticated) {
    return <NAPopUp />
  }
  return <div className=" w-full h-screen p-2">
    <Communities />
    <NewPost />
    <div className = 'flex flex-col pb-20 gap-3'>
          {
      posts.length > 0 && posts.map((post) => <Post postInfo = {post} />
      )
    }
    </div>
  </div>
}

export default Homepage