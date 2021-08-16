import { Link } from 'react-router-dom'
import styles from '../../css_modules/404.module.scss'

const NotFound = () => (
  <div className={styles.NotFoundBlock}>
    <h1>404 Not Found</h1>
    <code className={styles.NotFoundCodeBlock}>
      The Page you&apos;re looking for isn&apos;t here :P.
    </code>
    <Link className={styles.GoHomeLink} to="/">
      Go Home Now
    </Link>
  </div>
)

export default NotFound
