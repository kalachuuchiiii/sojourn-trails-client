import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/notification.jsx';
import axios from 'axios';

const NotificationList = ({ setUnreadNotifs }) => {
  const [notificationsToday, setNotificationsToday] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [page, setPage] = useState(0);
  const [isServerSideOK, setIsServerSideOK] = useState(false);
  const { user, authenticated, isDoneSessionLooking } = useSelector(state => state.user);

  



  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-notifications-of-user/${user._id}/${0}`);

        if (res?.data?.success) {
          const notifsToday = res.data.notifications.filter(notification => notification.createdAt.split("T")[0] === new Date().toISOString().split("T")[0])
          const notifs = res.data.notifications.filter(notification => notification.createdAt.split("T")[0] !== new Date().toISOString().split("T")[0])
          setNotificationsToday(notifsToday);
          setNotifications(notifs);
          setIsServerSideOK(true);
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (authenticated) {
      getNotifications();
    }
  }, [isDoneSessionLooking, authenticated]);

  if (!isServerSideOK) {
    return <div>Loading...</div>
  }

  if (!notifications && !notificationsToday) {
    return <div>No notifications yet</div>
  }

  return <div className='w-full '>
    <div>
      <p className='text-xl ml-2 mb-2 w-full text-left font-bold'>Today</p>
      <div className='divide-y '>
        {
          notificationsToday.length > 0 && notificationsToday.map(notification => <Notification setUnreadNotifs = {setUnreadNotifs} info={notification} />)
        }
      </div>
    </div>
    <div>
      <p className='text-xl ml-2 mb-2 w-full text-left font-bold'>Notifications</p>
      {
        notifications.map(notification => <Notification setUnreadNotifs = {setUnreadNotifs} info={notification} />)
      }
    </div>
  </div>

}

export default NotificationList