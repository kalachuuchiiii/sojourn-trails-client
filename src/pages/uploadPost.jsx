import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { TbPhotoShare } from "react-icons/tb";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { MoonLoader } from 'react-spinners';
import Placeholder from '../components/placeholder.jsx';
import NAPopUp from '../components/notAuthorizedPopup.jsx';
import Slider from '../components/slider.jsx';
import UserIcon from '../components/userIcon.jsx';
import StarRating from '../components/starRating.jsx';
import PopUp from '../components/popUp.jsx';


const UploadPost = ({ isSessionLookingDone }) => {
  const { user, authenticated } = useSelector(state => state.user);
  const [fileUrls, setFileUrls] = useState([]);

  const [postDesc, setPostDesc] = useState('');
  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rate, setRate] = useState(1);
  const textAreaRef = useRef(null);
  const fileRef = useRef(null);
  
  const offPopUp = () => {
    setTimeout(() => {
      setErrMsg('');
      setSuccess(false); 
    setIsError(false);
    }, 3000)
  }
  
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(fileUrls.length === 0 && postDesc.length === 0){
      setIsError(true); 
      setErrMsg('Describe your posts, and try to attach images or videos to make your post more engaging');
      offPopUp();
      return;
    }; 
    if(postDesc.length < 5){
      setIsError(true); 
      setErrMsg('Describe your post. Min 5 Characters');
      offPopUp();
      return;
    }
    if (fileUrls.length > 8) {
      setErrMsg('You can only upload up to 8 files.')
      setIsError(true);
      offPopUp();
      return;
    } 
    
    const format = {
      files: fileUrls,
      postDesc,
      postOf: user._id,
      rate 
    }
    
    setLoading(true);
    try{
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload-post`, { format })
      
      setSuccess(true);
      setLoading(false);
      offPopUp()
        if(res.data.success){
          window.location.href = `${import.meta.env.VITE_HOMEPAGE}`
        }
      
      
    }catch(e){
      console.log(e); 
      setErrMsg(e?.response?.data?.message || 'Internal Server Error'); 
      setIsError(true);
      setSuccess(false);
      setLoading(false);
      offPopUp();
    }
  }

  const handleChange = (e) => {
    if (e.target.value.length > 400) {
      return;
    }
    setPostDesc(e.target.value);
  }

  const handleFileChange = (e) => {
    const { files, name } = e.currentTarget;
    if (files.length === 0) return;
    if (files.length > 8) {
      setErrMsg('You can only upload up to 8 files.')
      setIsError(true);
      offPopUp();
    } else {
      const fileSizeLimit = 10; //MB 
      const haveExceeded10MBLimit = Array.from(files).some(file => file.size >= fileSizeLimit * (1024*1024))
      
      if (haveExceeded10MBLimit) {
        setErrMsg('File size exceeded 10MB limit.')
        setIsError(true);
        offPopUp();
        return;
      }

      const urls = Array.from(files).map((file) => {
        return new Promise((res) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            res({
              file: e.target.result,
              type: file?.type.startsWith("video/") ? "video" : "image"
            })
          }
          reader.onerror = () => {
            setErrMsg('File not supported.');
            setIsError(true);
            offPopUp();
          }

          reader.readAsDataURL(file);
        })
      })

      Promise.all(urls).then((urlFiles) => {
        setFileUrls(urlFiles);
      })
    }
  }

  useEffect(() => {
    const descRef = textAreaRef.current;
    if (!descRef) {
      return;
    }
    descRef.style.height = "auto";
    descRef.style.height = `${descRef.scrollHeight}px`;
  }, [postDesc])


  if ((!isSessionLookingDone && !authenticated)) {
    return <Placeholder />
  }

  if (isSessionLookingDone && !authenticated) {
    return <NAPopUp />
  }

  return <div className='grid gap-4'>
    <AnimatePresence>
      {
        isError ? <PopUp message={errMsg} /> : loading ? <PopUp message = "Uploading..." /> : success && <PopUp message = "Upload Success!" />
      }
    </AnimatePresence>
    <div className = ''>
      <div className = 'flex bg-neutral-50 items-center gap-1'>
                  <UserIcon info={user} />
                  <div className = ' grid gap-0'>
                                        <p className = 'font-bold text-sm'>{user.username}</p>
                               <p className = 'text-neutral-400 text-xs'>Author</p>         
                  </div>
                  
      </div>
          <div className = 'text-xs bg-neutral-100 rounded-lg grid gap-1 p-3'>
            <p >How would you rate this place?</p>
            <div className = 'text-base'>
                                    <StarRating viewOnly = {false} setRate = {setRate} rate = {rate}/>
            </div>
          </div>
    </div>

    <div className='w-full p-2 overflow-x-auto rounded outline'>
      <div >
        <textarea ref={textAreaRef} value={postDesc} onChange={handleChange} className='w-full z-20 hide-scrollbar p-2 min-h-[10vh] outline-none' placeholder='Write a description'></textarea>
        <div className='w-full h-full flex justify-end items-end'>
          <p className='text-xs text-neutral-400 '>{postDesc.length}/400</p>
        </div>
      </div>
      <div className=' w-full  rounded-lg mb-2 overflow-x-auto'>
        {
          fileUrls.length === 0 ? <div className='flex w-full h-60 bg-neutral-50 justify-center items-center'> <button disabled={isError} onClick={() => fileRef?.current.click()}>Upload files</button></div> : <Slider files={fileUrls} />
        }
      </div>

      <div className='w-full items-center justify-between p-2 flex rounded-lg bg-neutral-200'>
        <p className='text-xs'>Max file size: 10MB</p>
        <div className='flex flex-col  items-center gap-2'>
          <input ref={fileRef} disabled={isError} onChange={handleFileChange} id="imageId" multiple className='hidden' type="file" name="image" accept="image/*video/*" />
          <label className='active:scale-125 animation-transition gap-1 duration-200 flex  items-center' htmlFor="imageId" >                        <TbPhotoShare size="22" />

            <MdOutlineVideoLibrary size="22" />
          </label>
        </div>

      </div>
      <div className='w-full flex justify-end'>
        <button onClick={handleFormSubmit} className='bg-blue-400 rounded-lg p-2 my-2 text-white flex h-10  items-center justify-center w-5/12'>{loading ? <MoonLoader size = '20' color = "white" /> : 'Post'}</button>
      </div>
    </div>
  </div>

}

export default UploadPost