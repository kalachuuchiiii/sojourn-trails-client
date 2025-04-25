import { motion } from 'framer-motion';
import { pop } from '../motionVariants/variant.js';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

const NAPopup = () => {
  
  useEffect(() => {
    document.body.style.overflow = "hidden" 
    
    return() => {
      document.body.style.overflow = "" 
    }
  }, [])

return <div className = 'fixed inset-0 flex flex-col bg-black/80 justify-center z-80 items-center'>
  <motion.div
  variants = {pop} 
  initial = 'hidden' 
  animate = 'visible'
  >
    <div className = 'p-4 grid gap-1  bg-white rounded-lg truncate'>
      Youre not currently logged in.
      <NavLink className = 'text-blue-400 underline' to = '/login'>Login</NavLink>
    </div>
  </motion.div>
</div>

}

export default NAPopup