import { useEffect } from 'react';

const ZoomPreview = ({urlObj, onClose}) => {

const { type, file } = urlObj; 

useEffect(() => {
  document.body.style.overflow = "hidden" 
  return() => {
    document.body.style.overflow = "";
  }
}, [type, file])

return <div onClick = {onClose} className = 'flex items-center justify-center z-100 fixed inset-0 bg-black/85'>
  <main className = ' rounded-lg flex items-center justify-center size-76 ' >
    {
      type === 'image' ? <img onClick = {e => e.stopPropagation()} src = {file} className = '  rounded-lg object-fit'/> :   <video controls onClick = {e => e.stopPropagation()} src = {file} className = ' rounded-lg object-contain'/> 
    }
  </main>
</div>

}

export default ZoomPreview