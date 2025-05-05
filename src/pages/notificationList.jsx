import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Notification from '../components/notification.jsx';
import axios from 'axios';

const NotificationList = () => {
  const [notificationsToday, setNotificationsToday] = useState(null);
  const [notifications, setNotifications] = useState(null); 
  const [ page, setPage ] = useState(0);
  const { user, authenticated, isDoneSessionLooking } = useSelector(state => state.user);
  
  
  useEffect(() => {
    const getNotifications = async() => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-notifications-of-user/${user._id}/${page}`); 
        
        const notifsToday = res.data.notifications.filter(notification => notification.createdAt.split("T")[0] === new Date().toISOString().split("T")[0])
        const notifs = res.data.notifications.filter(notification => notification.createdAt.split("T")[0] !== new Date().toISOString().split("T")[0])
        setNotificationsToday(notifsToday);
        setNotifications(notifs)
      }catch(e){
        console.log(e)
      }
    }
    if(authenticated ){
      getNotifications();
    }
  }, [isDoneSessionLooking, authenticated]); 
  
  if(!notifications && !notificationsToday){
    return <div>No notifications yet</div>
  }

return <div className = 'w-full '>
  <div>
    <p className = 'w-full p-2 mt-1 bg-white'>Today</p>
    <div className = 'divide-y '>
          {
    notificationsToday.length > 0 && notificationsToday.map(notification => <Notification info = {notification}/>)
 }
    </div>
  </div>
  <div>
    <p className = 'w-full p-2 mt-1 bg-white'>Notifications</p>
    {
  notifications.map(notification => <Notification info = {notification} />)
}
  </div>
</div>

}

export default NotificationList