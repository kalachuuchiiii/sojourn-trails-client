import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { side } from '../motionVariants/variant.js';
import { clearState } from '../state/userSlice.js'

import { AnimatePresence } from 'framer-motion';
import OptionSidebar from '../modals/optionSidebar.jsx';
import { CiHome, CiSettings } from "react-icons/ci";
import { IoPersonOutline, IoPersonAddOutline } from "react-icons/io5";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { RiUserCommunityLine } from "react-icons/ri";


//'/', 
//   '/profile', 
//   '/settings', 
//   '/about',
//   '/friends',
//   '/requests',
//   '/communities'


const Navbar = () => {
  
  const { user, authenticated } = useSelector(state => state.user);
  const { pathname } = useLocation();
  
  const pages = [
  { to: '/', icon: <CiHome size = "24" />},
  { to: `/user/${user?._id}/posts`, icon: <IoPersonOutline size = "24"/>},
  { to: '/friends', icon: <LiaUserFriendsSolid size = "24"/>},
  { to: '/requests', icon: <IoPersonAddOutline size = "24"/>},
  { to: '/communities', icon: <RiUserCommunityLine size = "24" />},
  { to: '/settings', icon: <CiSettings size = "24"/>}
  
  ]
  
  const dispatch = useDispatch();
  
  const handleLogout = async() => {
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {_id: user._id}, {
        withCredentials: true
      })
      console.log(res)
      if(res.data.loggedOut){
        dispatch(clearState())
        window.location.href = `${import.meta.env.VITE_HOMEPAGE}/login` || 'http://localhost:5173/login';
      }
    }catch(e){
      console.log(e)
    }
  }
  
  


return <div className = 'w-full outline flex flex-col' >
  <div className = "z-40 w-full px-6 py-2 flex justify-between items-center">
      <NavLink to = "/"  className = "text-lg md:text-2xl">Sojourn</NavLink>
  <button onClick = {handleLogout}>
      {authenticated && <div className = 'bg-gray-200 flex items-center justify-center size-9 rounded-full'><img className = 'size-8 rounded-full object-cover' src = {user?.icon || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'} />
  </div>
      }
  </button>
  </div>
    <div className = 'flex w-full gap-1 my-2 px-2 items-center  justify-evenly'>
      {
    authenticated && pages.map(({to, icon}) => {
    return <NavLink className = {`p-3 transition-transform duration-300 rounded w-full outline ${pathname === to && ' z-10 outline-blue-400 outline-2' } flex items-center justify-center`} to = {to}>{icon}</NavLink>
    })
  }
  </div>
</div>

}

export default Navbar