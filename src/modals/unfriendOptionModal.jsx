import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { fromBottom, fade } from '../motionVariants/variant.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { unfriend } from '../utils/friendSystem.js';
import { MoonLoader } from 'react-spinners';

const UnfriendOptionModal = ({onClose, userOne, userTwo, setRelationshipStatus}) => {
  const { user: {_id}} = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  
    
    useEffect(() => {
      document.documentElement.style.overflow = "hidden" 
      return() => {
        document.documentElement.style.overflow = "" 
      }
    }, []); 
    
    const handleUnfriend = async() => {
      setLoading(true);
      try{
            const res = await unfriend({userOne, userTwo}); 
            console.log(res);
            if(res){
              setRelationshipStatus(res.data.status);
              setLoading(false);
              onClose();
            }
          }catch(e){
            console.log("unfriend", e)
          }
    }
    

return <motion.div
variants = {fade} 
initial = "hidden"
animate = "visible" 
exit = "hidden"
disabled = {loading}
onClick = {onClose}
className = 'fixed inset-0 z-50 bg-black/50  flex flex-col justify-end'>
  <motion.div
  variants = {fromBottom}
  >
      <div onClick = {e => e.stopPropagation()} className = 'bg-neutral-100 flex flex-col justify-between text-lg py-2  rounded-t-xl'>
  
            <button disabled = {loading} onClick = {onClose} className = 'p-3 w-full active:bg-neutral-200/50'>Close</button>
            <button disabled = {loading} onClick = {handleUnfriend} className = 'p-3 w-full active:bg-neutral-200/50 flex items-center justify-center text-red-400'>{
              loading ? <MoonLoader size = "20"/> : "Unfriend"
            }</button>
  </div>
  </motion.div>
</motion.div>

}

export default UnfriendOptionModal