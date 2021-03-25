import { css, StyleSheet } from 'aphrodite'
import { Link } from 'react-router-dom'

const styles = StyleSheet.create({
   NotFoundBlock: {
      width: '100%',
      height: '94.5vh',
      display: ' flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
   },
   NotFoundCodeBlock: {
      padding: '1rem',
      backgroundColor: '#335',
      color: '#eee',
      fontSize: '1.4rem',
      fontFamily: "'Jetbrains Mono', monospace",
   },
   GoHomeLink: {
      padding: '.5rem',
      ':after': {
         content: '',
         display: 'block',
         borderBottom: '3px solid #889',
      },
      ':hover': {
         color: '#778',
      },
   },
})

const NotFound = () => (
  <div className={css(styles.NotFoundBlock)}>
    <h1>404 Not Found</h1>
    <code className={css(styles.NotFoundCodeBlock)}>
      The Page you&apos;re looking for isn&apos;t here :P.
    </code>
    <Link className={css(styles.GoHomeLink)} to="/">
      Go Home Now
    </Link>
  </div>
)

export default NotFound
