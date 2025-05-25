import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsersByOption } from '../utils/getUserInfo.js';
import UserIcon from '../components/userIcon.jsx';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fade } from '../motionVariants/variant.js';
import { MoonLoader } from 'react-spinners';
import { closeLikers } from '../state/likersSlice.js';
import { FaHeart } from "react-icons/fa";

const LikerModal = () => {
  const { likerIds } = useSelector(state => state.liker);
  const [likerInfos, setLikerInfos] = useState([])
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeLikers());
  }
  const handleGetUsers = async () => {
    try {
      setLoading(true);
      const option = {
        _id: { $in: likerIds }
      }
      const res = await getUsersByOption({ option });
      console.log(res);
      setLikerInfos(res.data.users);
      setLoading(false);
    } catch (e) {
      console.log("liekr", e)
    }
  }

  useEffect(() => {
    handleGetUsers();
  }, [likerIds])

useEffect(() => {
  document.body.style.overflow = "hidden" 
  return()=> {
    document.body.style.overflow = "" 
  }
}, [])

  return <motion.div variants={fade}
    initial="hidden"
    animate="visible"
    exit="hidden"
    onClick={handleCloseModal}
    className='fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/85'
  >
    {
      loading ? <MoonLoader size="18" color="white" /> : <div onClick={(e) => e.stopPropagation()} className='h-100  w-11/12 rounded-lg overflow-y-scroll bg-neutral-100'>
        {
          likerInfos.length > 0 && <div >
            <p className = 'p-4 pb-0 text-sm'>Likes</p>{
    
            likerInfos.map((liker) => <NavLink onClick={handleCloseModal} className='p-3 flex p-2 justify-between active:bg-neutral-300 bg-neutral-100 items-center' to={`/user/${liker._id}/?data=posts`}>
              <div className='flex items-center'>
                <UserIcon info={liker} /><p>{liker?.nickname || liker.username}</p>
              </div>

              <FaHeart className='text-red-400 size-6' />

            </NavLink>
            )}</div>
        }
      </div>
    }
  </motion.div>

}

export default LikerModal