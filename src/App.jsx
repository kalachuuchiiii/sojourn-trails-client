import { useState, lazy, Suspense, useEffect } from 'react'
import { setUser } from './state/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Outlet } from 'react-router-dom';
import axios from 'axios';

const Register = lazy(() => import('./pages/register.jsx'))
const Login = lazy(() => import('./pages/login.jsx'))
const Homepage = lazy(() => import('./pages/homepage.jsx'));
const UploadPost = lazy(() => import('./pages/uploadPost.jsx'))
const PostPage = lazy(() => import('./pages/post.jsx'));
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import Placeholder from './components/placeholder.jsx';


function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [isSessionLookingDone, setIsSessionLookingDone] = useState(false);

  const checkSession = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/session`, {}, {
        withCredentials: true
      });
      const authenticated = res.data.authenticated;
      if (authenticated) {
        dispatch(setUser({ user: res.data.userInfo, authenticated }));
        setIsSessionLookingDone(true);
      }
    } catch (e) {
      
      setIsSessionLookingDone(true);

    }
    
  }

  useEffect(() => {
    checkSession();
  }, [dispatch])
  

  return <div className="h-screen flex flex-col items-center w-full ">
    <Suspense fallback={<Placeholder />}>
      <Routes>
        <Route element={<div className="flex flex-col justify-center items-center w-full gap-8">
          <Navbar />
          <div className="w-full p-1">
            <Outlet />
          </div>

        </div>}>

          <Route path='/' element={<Homepage isSessionLookingDone={isSessionLookingDone} />}  />
          <Route path='/upload' element={<UploadPost isSessionLookingDone={isSessionLookingDone} />} />
          <Route path = "/post/:postId" element = {<PostPage/>} />
        </Route>
      
<Route element = {<div className = "w-11/12 md:w-8/12 lg:w-6/12  flex justify-center items-center w-11/12">
  <Outlet />
</div>}>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
</Route>
      

      </Routes>
    </Suspense>

  </div>
}

export default App
