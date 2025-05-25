import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fade, fromBottomToTop } from '../motionVariants/variant.js';
import ZoomProfile from '../components/zoomPreview.jsx';
import PopUp from '../components/popUp.jsx';
import { FaPen } from "react-icons/fa";
import UserIcon from '../components/userIcon.jsx'
import { setUser } from '../state/userSlice.js';
import axios from "axios";

const EditProfile = () => {
  const { user, authenticated } = useSelector(state => state.user);
  const [editedForm, setEditedForm] = useState({
    nickname: "",
    bio: user?.bio || ""
  })
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const textareaRef = useRef(null);
  const [isNicknameInvalid, setIsNicknameInvalid] = useState(false);
  const [isZoomPrevOpen, setIsZoomPrevOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "nickname") {
      const isValid = /^[a-zA-Z0-9 _-]*$/.test(value);
      if (isValid) {
        setEditedForm(prev => ({ ...prev, nickname: value }))
        return;
      }
      return;
    }
    setEditedForm(prev => ({ ...prev, bio: value }))
  }

  const handleChangePreviewAvatar = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
    }

    reader.readAsDataURL(file);
  }

  const handleChangeIcon = async () => {
    try {
      if (!avatar) {
        return;
      }
      setIsLoading(true);
      console.log(avatar)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/change-icon`, {
        userId: user._id,
        icon: avatar
      })
      console.log(res)
      if (res) {
        setAvatar(null);
        setIsLoading(false);
        window.location.reload();
      }
    } catch (e) {
      console.log("changeicon", e)
    }
  }

  const handleChangeBio = async () => {
    setIsLoading(true);
    try {
      let { bio } = editedForm;
      bio.trim();
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/change-bio`, {
        bio,
        userId: user._id
      })
      dispatch(setUser({ user: { ...user, bio } }))
      
      setIsLoading(false);
      setSaved(true)
      setTimeout(() => {
        setSaved(false);
      }, 1000)
    } catch (e) {
      console.log("bio", e)
    }
  }

  const handleChangeNickname = async () => {
    setIsLoading(true)
    try {
      let { nickname } = editedForm;
      nickname.trim();
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/change-nickname`, {
        userId: user._id,
        nickname
      })
      console.log("nickn", res)
      dispatch(setUser({ user: { ...user, nickname } }))
      setEditedForm(prev => ({ ...prev, nickname: "" }))
      setIsLoading(false)
      setTimeout(() => {
        setSaved(false);
      }, 1000)
    } catch (e) {
      console.log("nickn", e)
    }
  }

  useEffect(() => {
    const tRef = textareaRef.current;
    if (tRef) {
      tRef.style.height = "auto";
      tRef.style.height = `${tRef.scrollHeight}px`
    }
  }, [editedForm.bio])

  if (!authenticated) {
    return <div></div>
  }

  return <motion.div variants={fade} initial="hidden" animate="visible" exit="hidden"
    className='fixed inset-0 bg-black/85'
  >
    <AnimatePresence >
      {
        isLoading ? <PopUp /> : avatar?.length > 0 ? <div
          onClick={() => setAvatar(null)} disabled={isLoading} className="fixed bg-black/85 inset-0 w-full grid place-content-center">
          <div onClick={e => e.stopPropagation()} className="bg-white  p-2 rounded flex flex-col items-center justify-center gap-4">
            <UserIcon info={{ icon: avatar, online: false }} size="60" />
            <p>Save as your new icon?</p>
            <div className="flex gap-2 w-full ">
              <button onClick={() => setAvatar(null)} className="bg-neutral-100 p-2 rounded w-full text-black">Cancel</button>
              <button onClick={handleChangeIcon} disabled={isLoading} className="bg-blue-400 p-2 rounded w-full text-white">Save</button>
            </div>
          </div>
        </div> : (isZoomPrevOpen && user?.icon) ? <ZoomProfile urlObj={{ type: "image", file: user.icon }} onClose={() => setIsZoomPrevOpen(false)} /> : saved && <PopUp message="Saved!" />
      }
    </AnimatePresence>

    <motion.div variants={fromBottomToTop} className='bg-neutral-50 p-2 w-full h-full'>
      <div className='w-full h-full gap-8 flex flex-col'>
        <h1 className='font-bold text-lg'>Edit Profile</h1>
        <div >
          <div className='flex flex-col items-center justify-center p-4'>
            <button onClick={() => setIsZoomPrevOpen(true)} >
              <UserIcon info={user} size="40" /></button>
            <input onChange={(e) => handleChangePreviewAvatar(e.target.files[0])} id="imageInput" type="file" accept="image/*" className="hidden" />
            <button disabled={isLoading} onClick={() => document.getElementById("imageInput").click()} className='p-2 text-sm'>Change Photo</button>
          </div>
        </div>
        <div className='flex flex-col justify-center gap-2 p-2'>
          <p className='text-xs'>Think of a nickname your friends will recognize you by.</p>
          <div className='flex gap-2 w-full items-center p-2'>
            <input onChange={handleChange} name="nickname" placeholder={`@${user?.nickname || user?.username}`} value={editedForm.nickname} className='outline-none w-full ' />
            <FaPen onClick={handleChangeNickname} />
          </div>

        </div>
        <div className='flex flex-col justify-center p-2'>
          <p className='text-xs'>Let people know what you’re about. Update your bio here.</p>
          <textarea ref={textareaRef} value={editedForm.bio} onChange={handleChange} name="bio" className='p-2 outline-none bg-neutral-50 rounded' />
          <button onClick={handleChangeBio} disabled={editedForm.bio.length <= 0 || editedForm.bio === user?.bio} className={`${(editedForm.bio.length > 0 && editedForm.bio !== user?.bio) ? "bg-blue-400" : "bg-blue-200"} p-2 rounded text-white`}>Save</button>
        </div>
      </div>
    </motion.div>
  </motion.div>

}

export default EditProfile