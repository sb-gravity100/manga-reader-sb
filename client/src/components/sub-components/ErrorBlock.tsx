import { FC } from 'react';
import styles from '../../style.module.scss';
import { ErrorProps } from '../props';

const ErrorBlock: FC<ErrorProps> = ({
   children,
   hasErrors,
   errors,
   retry,
   isFetching,
}) => {
   if (hasErrors) {
      console.log(hasErrors);
      return (
         <div className={styles.errorBlock}>
            <h3>Something went wrong...</h3>
            <button
               className={styles.retryBtn}
               onClick={() => retry()}
               style={{ cursor: isFetching ? 'progress' : 'pointer' }}
            >
               {isFetching ? 'Retrying...' : 'Retry?'}
            </button>
            <code className={styles.errorMsg}>{errors?.message}</code>
         </div>
      );
   }
   return <>{children}</>;
};

export default ErrorBlock;
