import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { side } from '../motionVariants/variant.js';
import UserIcon from './userIcon.jsx'
import { clearState } from '../state/userSlice.js'

import { AnimatePresence } from 'framer-motion';
import OptionSidebar from '../modals/optionSidebar.jsx';
import { CiHome, CiSettings } from "react-icons/ci";
import { IoPersonOutline, IoPersonAddOutline } from "react-icons/io5";
import { FaRegBell } from 'react-icons/fa'
import { RiUserCommunityLine } from "react-icons/ri";
import NotifIndicator from './notification.jsx';


//'/', 
//   '/profile', 
//   '/settings', 
//   '/about',
//   '/friends',
//   '/requests',
//   '/communities'


const Navbar = ({ unreadNotifs }) => {

  const { user, authenticated } = useSelector(state => state.user);
  const { pathname } = useLocation();

  const pages = [
    { to: '/', icon: <CiHome size="24" />, url: '/' },
    { to: `/user/${user?._id}/?data=posts`, icon: <IoPersonOutline size="24" />, url: `/user/${user?._id}/` },
    {
      to: '/requests', icon: unreadNotifs?.request <= 0 ? <IoPersonAddOutline size="24" /> : <NotifIndicator>
        <IoPersonAddOutline size="24" />
      </NotifIndicator>, url: `/requests`
    },
    { to: '/communities', icon: <RiUserCommunityLine size="24" />, url: `/communities` },
    {
      to: '/notifications', icon: unreadNotifs?.notif <= 0 ? <FaRegBell size="24" /> : <NotifIndicator><FaRegBell size="24" /></NotifIndicator>, url: `/notifications`
    },
    { to: '/settings', icon: <CiSettings size="24" />, url: `/settings` }
  ]

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, { _id: user._id }, {
        withCredentials: true
      })
      
      if (res.data.loggedOut) {
        dispatch(clearState())
        window.location.href = `${import.meta.env.VITE_HOMEPAGE}/login` || 'http://localhost:5173/login';
      }
    } catch (e) {
      console.log(e)
    }
  }

  


  return <div className='w-full sticky top-0 bg-gradient-to-b from-neutral-100 to-transparent  flex flex-col' >
    <div className="z-40 w-full px-6 py-2 flex justify-between items-center">
      <NavLink to="/" className="text-lg md:text-2xl">Sojourn</NavLink>
      <button onClick={handleLogout}>
        {authenticated && <div className='bg-gray-200 flex items-center justify-center size-9 rounded-full'>
          <UserIcon info = {user} />
        </div>
        }
      </button>
    </div>
    <div className='flex w-full gap-1 my-2 px-2 items-center  justify-evenly'>
      {
        authenticated && pages.map(({ to, icon, url }) => {
          return <NavLink className={`p-3 transition-transform duration-300  z-10 rounded-t w-full  ${pathname === url ? ' border-b-2 border-blue-400' : 'border-b-2 border-transparent'} flex items-center justify-center`} to={to}>{icon}</NavLink>
        })
      }
    </div>
  </div>

}

export default Navbar