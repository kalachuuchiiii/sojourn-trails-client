import { useState, useEffect } from 'react'
import { MdNavigateBefore, MdNavigateNext} from "react-icons/md";
import PreviewFile from './previewFile.jsx';
import SliderIndicator from './sliderIndicator.jsx'
const Slider = ({files = []}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    setCurrentSlide(0)
  }, [files])
  

return <div className = 'w-full rounded-lg overflow-hidden z-10 bg-neutral-100 grid h-60 md:h-80 lg:h-100'>
  {
    files.length > 1 &&  <div className = 'w-full  h-full row-start-1 col-start-1 flex justify-between'>
    <div className = 'w-[20%]  h-full  flex flex-col justify-center items-center'>
    
    <button onClick = {() => setCurrentSlide(prev => prev === 0 ? files.length - 1 : prev -1)} className = 'p-1 z-40 active:bg-black/50  rounded-full bg-black/10' >
              <MdNavigateBefore  className = 'z-20' size = "30" color = "white" />
      
    </button>
    </div>
    <div className = 'w-[20%]  h-full  flex flex-col justify-center items-center rounded-full '>
    
        <button className = 'p-1 z-40 active:bg-black/50   rounded-full bg-black/10 ' onClick = {() => setCurrentSlide(prev => prev === files.length - 1 ? 0 : prev + 1)} >
                <MdNavigateNext  size = "30" color = "white" />
                </button>
      
      
    </div>
  </div>
  }
  {
    files.length > 0 && <div className = 'w-full h-60 md:h-80 lg:h-100 row-start-1 p-2   col-start-1'>
    <PreviewFile fileInfo = {files[currentSlide]} />
  </div> 
  }
  {
    files.length > 0 && <div className = 'row-start-1 w-full z-40 pointer-events-none col-start-1 flex items-end'>
      <SliderIndicator number = {files.length} currIndex = {currentSlide} setCurrentIndex = {setCurrentSlide} />
    </div>
  }

</div>

}

export default Slider