import { FaHeart } from 'react-icons/fa'
import { tada } from 'react-animations'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
   tada: {
      ':hover': {
         animation: `${tada} 1s ease-out`,
         color: '#f7f',
      },
   },
})

const Footer = () => (
  <footer>
    <p className={css(styles.tada)}>
      Thanks for Reading my manga reader
      {' '}
      <FaHeart fontSize="1.2rem" color="pink" />
      {' '}
    </p>
  </footer>
   )

export default Footer
