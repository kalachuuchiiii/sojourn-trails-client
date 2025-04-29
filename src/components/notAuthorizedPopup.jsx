import { motion } from 'framer-motion';
import { fade } from '../motionVariants/variant.js';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

const NAPopup = ({onClose}) => {
  
  useEffect(() => {
    document.body.style.overflow = "hidden" 
    
    return() => {
      document.body.style.overflow = "" 
    }
  }, [])

return <motion.div
  variants = {fade} 
  initial = 'hidden' 
  animate = 'visible'
  exit = "hidden"
  onClick = {onClose} className = 'fixed inset-0 flex  bg-black/80 justify-center z-50 items-center'
  >
    <div onClick = {e => e.stopPropagation()} className = 'p-8 grid justify-center text-center gap-6 z-50 w-11/12 md:w-8/12 lg:w-6/12 bg-white rounded-lg '>
      <div className = 'grid gap-2'>
              <p className = 'text-xs text-neutral-400'>Sojourn Trails</p>
      <p>To like, comment, and access all features, please log in or create an account.</p>
      </div>
      <NavLink className = ' bg-blue-400 text-white p-2 rounded-lg ' to = '/login'>Login</NavLink>
    </div>
  </motion.div>

}

export default NAPopup