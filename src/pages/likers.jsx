import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Likers = () => {
  const [likers, setLikers] = useState([]);
  const [isServerSideOK, setIsServerSideOK] = useState(false);
  const { postId } = useParams;
  const nav = useNavigate();

  const handleGoBack = () => {
    nav(-1);
  }

  const getLikers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-likers/${postId}`);
      if (res.data.success) {
        setLikers(res.data.likersInfo);
        console.log(res)
        setIsServerSideOK(true);
      }
    } catch (e) {
      console.log("getLikers", e)
    }
  }

  useEffect(() => {
    getLikers();
  }, [postId])

  if (!isServerSideOK) {
    return <div>Loading..</div>
  }

  return <div>
    <div>
      {
        likers.length > 0 && likers.map((liker) => {
          return <div>
            {liker.username}
          </div>
        })
      }
    </div>
  </div>

}

export default Likers