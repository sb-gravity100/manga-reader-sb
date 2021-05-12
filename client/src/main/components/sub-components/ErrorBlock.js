import { useState } from 'react'
import styles from '../../css_modules/ErrorBlock.module.scss'

const ErrorBlock = ({
 children, hasErrors, errors, retry, loading, status
}) => {
  if (hasErrors) {
    console.log(hasErrors)
    return (
      <div className={styles.errorBlock}>
        <h3>Something went wrong...</h3>
        <button
          className={styles.retryBtn}
          onClick={() => retry()}
          style={{ cursor: status === 4 ? 'progress' : 'pointer' }}
        >
          {status === 4 ? 'Retrying...' : 'Retry?'}
        </button>
        <code className={styles.errorMsg}>{errors.message}</code>
      </div>
    )
  }
  return children
}

export default ErrorBlock
