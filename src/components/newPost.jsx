
import { TbPhotoShare } from "react-icons/tb";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { NavLink } from 'react-router-dom';

const NewPost = () => {

return <div className = 'w-full bg-neutral-100 rounded-lg my-2 overflow-x-hidden' >
  <NavLink to = '/upload' className = 'w-full h-14 flex items-center p-2'>
    <input placeholder = "What's on your mind?" className = 'w-full p-1 outline-none pointer-events-none' />
    <div className = ' flex gap-2 items-center h-full'>
      <TbPhotoShare size = '25'/>
      <MdOutlineVideoLibrary size = '25'/>
    </div>
  </NavLink>
</div>

}

export default NewPost