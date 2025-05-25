const NotifIndicator = ({ children = <p></p>, color = "blue-400", position = "justify-end items-start"}) => {
  return <div className='grid place-content-center'>
    <div className='row-start-1 col-start-1'>
      {children}
    </div>
    <div className={`row-start-1 flex  col-start-1  ${position}`}>
      <div className={`size-2 rounded-full 
      bg-${color}`}></div>
    </div>
  </div>
}

export default NotifIndicator;