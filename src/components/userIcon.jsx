
import { useState, useEffect } from 'react';
const UserIcon = ({info, size = 9}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  if(!info){
    return <p>..</p>
  }

return <div className = '  rounded-lg flex items-center gap-4 '>
  <div  className = {`size-${size} rounded-full ${info?.online ? "bg-gradient-to-br from-blue-400 to-blue-100" : "bg-neutral-300"} flex items-center justify-center`}>
    <div className = {`size-${size > 30 ? size - 2 : size - 1}  ${imgLoaded ? "hidden" : "visible rounded-full bg-white object-cover"}`}>
      
    </div>
    <img onLoad = {() => setImgLoaded(true)} src = {info?.icon || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'} className = {`size-${size - (size * 0.10)} ${imgLoaded ? "visible" : "hidden"} rounded-full object-cover`} />
  </div>

</div>




}

export default UserIcon