import { motion } from 'framer-motion'; 
import { fade } from '../motionVariants/variant.js';

const ErrorPopUp = ({message = "Internal Server Error"}) => {

return <motion.div
variants = {fade}
initial = "hidden" 
animate = "visible" 
exit = "hidden" 
className = 'fixed z-100 inset-0 flex justify-center items-center'>
  <div className = 'bg-black/80 z-50 p-2 rounded text-white flex items-center justify-center'>
    <p>{message}</p>
  </div>
</motion.div>

}

export default ErrorPopUp