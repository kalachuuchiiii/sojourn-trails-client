import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Community from '../components/community.jsx';
import NewPost from '../components/newPost.jsx';
import axios from 'axios';
import Communities from '../components/communities.jsx';
import Placeholder from '../components/placeholder.jsx';
import NAPopUp from '../components/notAuthorizedPopup.jsx';


const Homepage = ({isSessionLookingDone}) => {
  const { user, authenticated } = useSelector(state => state.user);
  const nav = useNavigate();
  
  
  console.log(isSessionLookingDone, authenticated)
  

if(!isSessionLookingDone && !authenticated){
  return <Placeholder/>
}

if(isSessionLookingDone && !authenticated){
  return <NAPopUp/>
}
return <div className = " w-full h-screen p-2">
  <Communities />
  <NewPost/>
</div>
}

export default Homepage