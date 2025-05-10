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

export const fromBottom = {
  visible: {
    y:0,
    opacity:1,
    transition: {
      duration: 0.3, 
      type: 'tween'
    }
  }, 
  hidden: {
    y:"100%",
    opacity:0,
    transition: {
      duration: 0.3, 
      type: 'tween'
    }
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

