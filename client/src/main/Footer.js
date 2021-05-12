import { FaHeart } from 'react-icons/fa'
import { useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import styles from './css_modules/Footer.module.scss'

const Footer = () => {
  const ref = useRef(0)
  const props = useSpring({
    to: async next => {
      await next({ color: '#afe', translateY: -2, opacity: 1 })
      await next({ rotateZ: 30 })
      await next({ rotateZ: -30 })
      await next({ rotateZ: 360, config: { tension: 100 } })
      await next({ translateX: 1200, config: { mass: 10, tension: 150 } })
    },
    from: {
      color: 'white',
      translateY: 10,
      opacity: 0,
      rotateZ: 0,
      translateX: 10
    },
    loop: () => ref.current++ < 5,
    reset: true,
    delay: 500
  })
  return (
  <footer>
    <p className={styles.p_overflow} >
      Thanks for Reading my manga reader
      {' '}
      <animated.span style={props} ><FaHeart fontSize="1.2rem" /></animated.span>
      {' '}
    </p>
  </footer>
   )
}

export default Footer
