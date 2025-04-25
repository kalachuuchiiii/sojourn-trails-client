import { useState } from 'react';
import { motion } from 'framer-motion';
import { pulse, fade } from '../motionVariants/variant.js';

const Community = ({ info }) => {
  const [haveImgLoaded, setHaveImgLoaded] = useState(false);

  const { image, university } = info;
  return <div className="w-32 transition-colors duration-200 active:bg-black/30 overflow-hidden rounded-lg h-32">
    {
      !haveImgLoaded && <motion.div
        variants={pulse}
        animate="animate"
        exit = "hidden"
        className="w-32 h-32 bg-gray-300 rounded"></motion.div>
    }

<div className = 'grid w-full place-items-center'>
      <img
      className={`${haveImgLoaded ? 'visible' : 'hidden'} col-start-1 row-start-1 rounded w-full h-full object-cover `} src={image} onLoad={() => setHaveImgLoaded(true)} />
      {
        haveImgLoaded && <div className= 'col-start-1 w-full overflow-hidden row-start-1 h-full flex flex-col justify-end'>
          <p className = ' truncate text-neutral-100 bg-gradient-to-t from-black/50 to-transparent w-full p-2'>{university}</p>
        </div>
      }
</div>

  </div>

}

export default Community