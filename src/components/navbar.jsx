import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { NavLink, useLocation } from 'react-router-dom';
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
  { to: `/user/${user?._id}`, icon: <IoPersonOutline size = "24"/>},
  { to: '/friends', icon: <LiaUserFriendsSolid size = "24"/>},
  { to: '/requests', icon: <IoPersonAddOutline size = "24"/>},
  { to: '/communities', icon: <RiUserCommunityLine size = "24" />},
  { to: '/settings', icon: <CiSettings size = "24"/>}
  
  ]
  
  


return <div className = 'w-full flex flex-col' >
  <div className = "z-40 bg-white shadow-md w-full px-6 py-3 flex justify-between items-center">
      <NavLink to = "/"  className = "text-lg md:text-2xl">Sojourn</NavLink>
  <NavLink to = {`/user/${user._id}`}>
      {authenticated && <div className = 'bg-gray-200 flex items-center justify-center size-9 rounded-full'><img className = 'size-8 rounded-full object-cover' src = {user?.icon || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'} />
  </div>
      }
  </NavLink>
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