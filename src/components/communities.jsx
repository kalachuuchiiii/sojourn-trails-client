import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pulse } from '../motionVariants/variant.js';
import { GrNext } from "react-icons/gr";
import Community from './community.jsx';
import axios from 'axios';

const Communities = () => {
  const [communities, setCommunities] = useState([])
  const [isFetchedSuccess, setIsFetchedSuccess] = useState(false);

  const getCommunities = async () => {
    try {
      const res = await axios.get(`https://dummyjson.com/users`);
      console.log(res)
      if (res?.data?.users?.length > 0) {
        setCommunities(res.data.users);
        setIsFetchedSuccess(true)
      }

    } catch (e) {
      console.log(e)
      setIsFetchedSuccess(false);
    }
  }

  useEffect(() => {
    getCommunities();
  }, [])

  return <div className='bg-neutral-100 rounded-lg p-2'>
    <p className='text-neutral-400 text-xs'>Communities</p>
    <div className='overflow-x-auto hide-scrollbar rounded-lg'>

      <div className="flex items-center gap-2  w-max">
        <AnimatePresence>
          {
            !isFetchedSuccess && Array(10).fill().map((item, i)=> <motion.div
              variants={pulse}
              animate="animate"
              key = {i}
              className="w-32 h-32 bg-gray-300 rounded"></motion.div>)

          }
        </AnimatePresence>
        {
          isFetchedSuccess && communities.map(community => <Community key = {community._id} info={community} />)
        }
        {
          isFetchedSuccess && <div className='w-32 flex items-center justify-center h-32'>
            <section className='flex flex-col items-center text-center gap-2 justify-center'>
              <p className='text-sm'>Browse Communities</p>
              <button className='active:bg-neutral-300 transition-colors duration-200 rounded-full w-16 h-16 bg-white flex items-center justify-center shadow-md'><GrNext /></button>
            </section>
          </div>
        }
      </div>
    </div>
  </div>


}

export default Communities