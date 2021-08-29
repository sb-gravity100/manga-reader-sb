import { FC } from 'react';
import styles from '../../style.module.scss';

const Loading: FC = () => (
   <div className={styles.loading_style}>
      <h3>
         <div className="loading-animation">Loading...</div>
      </h3>
   </div>
);

export default Loading;
