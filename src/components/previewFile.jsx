import { useState } from 'react'; 
import { MoonLoader } from 'react-spinners';
import { IoMdPlay } from "react-icons/io";
import ZoomPreview from './zoomPreview.jsx';

const PreviewFile = ({fileInfo}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomObj, setZoomObj] = useState({});
  
const type = fileInfo?.type || 'image'
const file = fileInfo?.file;

return <div className = ' w-full overflow-hidden flex justify-center rounded-lg  items-center h-full'>
  {
    Object.values(zoomObj).length > 0 && <ZoomPreview urlObj = {zoomObj} onClose = {() => setZoomObj({})}/>
  }
{
  !isLoaded && <div className = 'w-full h-full flex items-center row-start-1 col-start-1 justify-center'>
    <MoonLoader size = "30" color = "black"/>
  </div>
}
  {
    type === "image" ? <img onClick = {() => setZoomObj(fileInfo)} onLoad = {() => setIsLoaded(true)}  className = {` object-cover z-50 rounded-lg ${!isLoaded && ' hidden ' }`} src = {file} /> : <div className = 'grid place-content-center'>
      {
        isLoaded &&             <button onClick = {() => setZoomObj(fileInfo)} className = 'row-start-1 col-start-1 text-white h-full w-full flex items-center justify-center z-40'>
         <IoMdPlay size = '30'/>
      </button>
      }
      <video  onLoadedData = {() => setIsLoaded(true)} onCanPlay = {() => setIsLoaded(true)}  className = {` h-full col-start-1 row-start-1 object-fit  ${!isLoaded && ' hidden ' }`}   src = {file}  />
    </div>
  }
</div>

}

export default PreviewFile