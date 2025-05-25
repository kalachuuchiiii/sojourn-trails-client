import { useState, lazy, Suspense, useEffect } from 'react'
import { setUser } from './state/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = lazy(() => import('./pages/register.jsx'))
const Login = lazy(() => import('./pages/login.jsx'))
const Likers = lazy(() => import("./pages/likers.jsx"));
const CommentReply = lazy(() => import('./pages/commentReply.jsx'));
const EditProfile = lazy(() => import('./pages/editProfile.jsx'));
const Homepage = lazy(() => import('./pages/homepage.jsx'));
const UploadPost = lazy(() => import('./pages/uploadPost.jsx'))
const PostPage = lazy(() => import('./pages/post.jsx'));
const FriendRequestList = lazy(() => import('./pages/friendRequests.jsx'));
const Profile = lazy(() => import('./pages/profile.jsx'));
const SentRequestsPage = lazy(() => import("./pages/sentRequests.jsx"))
const CommunityList = lazy(() => import('./pages/communityList.jsx'));
const Settings = lazy(() => import('./pages/settings.jsx'));
const OnBoarding = lazy(() => import("./pages/onBoarding.jsx"))
const Notifications = lazy(() => import('./pages/notificationList.jsx'));
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import Placeholder from './components/placeholder.jsx';
import LikerModal from './modals/likersModal.jsx';
import Posts from './pages/posts.jsx';
import DreamList from './pages/dreamList.jsx';
import NotAuthorizedNotice from './components/notAuthorizedPopup.jsx';
function App() {
  const dispatch = useDispatch();
  const { user, authenticated } = useSelector(state => state.user)
  const { isLikerModalOpen } = useSelector(state => state.liker);
  const [isSessionLookingDone, setIsSessionLookingDone] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState({
    notif: 0, 
    request: 0
  })
  const nav = useNavigate();
  
  const turnOnline = async(userId) => {
    try{
         axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/turn-online`, {
           userId
         })
         
        }catch(e){
          console.log("onl", e)
        }
  }
  const turnOffline = async(userId) => {
    try{
         axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/turn-offline`, {
           userId
         })
         
        }catch(e){
          console.log("offline", e)
        }
  }
  
  
  
  const checkSession = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/session`, {}, {
        withCredentials: true
      });
      const authenticated = res.data.authenticated;
      if (authenticated) {
        const { userInfo } = res.data;
        dispatch(setUser({ user: {...userInfo, online: true }, authenticated }));
        setIsSessionLookingDone(true);
        turnOnline(userInfo._id)
       await lookForUnreadMessages(userInfo._id)
       
      } else {
        throw new Error();
      }
    } catch (e) {
      dispatch(setUser({ user: {}, authenticated: false }))
      setIsSessionLookingDone(true);

    }
  }
  
  const lookForUnreadMessages = async(userId) => {
    try{
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/look-for-unread-notif/${userId}`)
      if(res?.data){
        const { notif, request } = res.data; 
        setUnreadNotifs({notif, request});
      }
        }catch(e){
          console.log("unreaf", e)
        }
  }
  

  useEffect(() => {
    if(!authenticated ){
      checkSession();
    }
    return()=> {
      if(authenticated && user?._id){
        turnOffline(user._id);
      }
    }
  }, [dispatch, authenticated, user]);

  return <div className="h-screen flex flex-col items-center w-full ">

    <Suspense fallback={<Placeholder />}>
      <Routes>
        <Route path="/customize-feed" element={<OnBoarding />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/likes/:postId" element={<Likers />} />
        <Route element={<div className="flex flex-col justify-center items-center w-full gap-8">
          <Navbar unreadNotifs = {unreadNotifs} />
          <AnimatePresence>
            {
              isLikerModalOpen && <LikerModal />
            }
          </AnimatePresence>
          <div className="w-full p-1">
            <Outlet />
          </div>

        </div>}>
          <Route path='/' element={<Homepage isSessionLookingDone={isSessionLookingDone} />} />
          <Route path="/sent-requests" element={<SentRequestsPage />} />
          <Route path='/upload' element={<UploadPost isSessionLookingDone={isSessionLookingDone} />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/user/:userId" element={<Profile />} />
          <Route path="/notifications" element={<Notifications setUnreadNotifs = {setUnreadNotifs} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/requests" element={<FriendRequestList setUnreadNotifs = {setUnreadNotifs}  />} />
          <Route path="/communities" element={<CommunityList />} />
          <Route path="/comment/:commentId/reply/:replyId" element={<CommentReply />} />
        </Route>

        <Route element={<div className="w-11/12 md:w-8/12 lg:w-6/12  flex justify-center items-center w-11/12">
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
