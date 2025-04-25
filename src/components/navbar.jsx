import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import OptionSidebar from '../modals/optionSidebar.jsx';


const Navbar = () => {
  
  const { user, authenticated } = useSelector(state => state.user);
  const [isOptionSidebarOpen, setIsOptionSidebarOpen] = useState(false);
  


return <div className = "z-40 bg-white shadow-md w-full p-5 md:p-8 flex justify-between items-center">
  <AnimatePresence>
      {
    isOptionSidebarOpen && <OptionSidebar onClose = {() => setIsOptionSidebarOpen(false)} />
  }
  </AnimatePresence>
  <p className = "text-lg md:text-2xl">Sojourn</p>
  <button onClick = {() => setIsOptionSidebarOpen(true)}>
      {authenticated && user.username || user?.nickname }
  </button>
</div>

}

export default Navbar