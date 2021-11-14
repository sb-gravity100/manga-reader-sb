import { FaHeart } from 'react-icons/fa';
import styles from './style.module.scss';

const Footer = () => {
  return (
    <footer>
      <p className={styles.p_overflow}>
        Thanks for Reading my manga reader <FaHeart fontSize="1.2rem" />
      </p>
    </footer>
  );
};

export default Footer;
