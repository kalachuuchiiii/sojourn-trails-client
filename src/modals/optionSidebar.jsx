import { motion } from 'framer-motion';
import { side } from '../motionVariants/variant.js';
import { clearState } from '../state/userSlice.js'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const OptionSetting = ({onClose}) => {
  const { user, authenticated } = useSelector(state => state.user);
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

return <motion.div
variants = {side}
initial = "hidden" 
animate = "visible" 
exit = "hidden"
onClick = {onClose}
className = 'fixed  inset-0 z-60'>
  <div onClick = {e => e.stopPropagation()} className = "bg-gray-800 w-4/12 absolute right-0 h-screen overflow-hidden rounded shadow-md p-4 text-neutral-100 text-xs">
    {
      authenticated && <button className = "p-2 w-full">Profile</button>
    }
    <button className = "p-2 w-full">Communities</button>
    <button className = "p-2 w-full">Dark Mode</button>
    <button onClick = {handleLogout} className = "p-2 w-full">Logout</button>
    <button onClick = {onClose} className = "p-2 w-full">Close</button>
  </div>
</motion.div>

}

export default OptionSetting