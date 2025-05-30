import { motion } from 'framer-motion'; 
import { fade } from '../motionVariants/variant.js';
import { useEffect } from 'react';

const PopUp = ({message = <div className = ' bg-gradient-to-br from-blue-400 to-white animate-spin size-8 rounded-full grid place-items-center'><div className = "size-6 rounded-full bg-black/80">
  
</div></div>}) => {
  
  useEffect(()=> {

      document.documentElement.style.pointerEvents = "none"
      document.body.style.overflow = "hidden" 
    
    return() => {
      document.documentElement.style.pointerEvents = ""
      document.body.style.overflow = "" 
    }
  }, [])


return <motion.div
variants = {fade}
initial = "hidden" 
animate = "visible" 
exit = "hidden" 
className = 'fixed z-50 bg-white/80 inset-0 flex justify-center items-center'>
  <div className = 'bg-black/80 z-50 max-w-11/12 p-2 rounded text-white flex items-center justify-center'>
    <p className = 'z-50'>{message}</p>
  </div>
</motion.div>

}

export default PopUp