import { motion } from 'framer-motion'; 
import { pulse } from '../motionVariants/variant.js';

const Placeholder = () => {

return <div className = 'bg-white fixed z-80 inset-0'>
  <motion.div
variants = {pulse}
animate = "animate"
className = 'flex flex-col justify-between fixed gap-4  z-50 p-4  inset-0'>
  <div className = 'w-6/12 rounded-lg bg-black/30 h-10'></div>
  <div className = 'w-11/12 rounded-lg bg-black/30 h-10'></div>
  <div className = 'w-full rounded-lg bg-black/30 h-full'></div>
</motion.div>
</div>

}

export default Placeholder