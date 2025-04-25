export const fade = {
  visible: {
    opacity:1, 
    transition: {
      duration: 0.25
    }
  }, 
  hidden: {
    opacity:0
  }
}

export const side = {
  hidden: {
    x: '100%'
  },
  visible: {
    x:0,
    transition: {
      duration: 0.5, 
      type: 'tween'
    }
  }
}

export const pulse = {
  animate: {
    opacity: [1, 0.3, 1], 
    transition: {
      duration: 1, 
      repeat: Infinity, 
      repeatType: 'loop', 
      ease: 'easeInOut'
    }
    
  }, 
  hidden: {
    opacity:0
  }
}

export const pop = {
  hidden: {
    height:0, 
    width:0,
    opacity:0
  },
    visible: {
      height:'20px', 
      width: '70%',
      opacity: 1, 
      transition: {
        duration: 0.3
      }
    }
}