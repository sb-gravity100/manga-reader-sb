import { StyleSheet, css } from 'aphrodite'
import { useState } from 'react'

const styles = StyleSheet.create({
  errorMsg: {
    padding: '5px 10px',
    backgroundColor: '#f88',
    color: '#d33',
    borderRadius: '10px',
  },
  errorBlock: {
    width: '100vw',
    height: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  retryBtn: {
    padding: '5px',
    textAlign: 'center',
    background: 'transparent',
    border: 'none',
  },
})

const ErrorBlock = ({
 children, hasErrors, errors, retry,
}) => {
  if (hasErrors) {
    console.log(errors)
    if (errors.message === 499) {
      return children
    }
    return (
      <div className={css(styles.errorBlock)}>
        <h3>Something went wrong...</h3>
        <button
          className={css(styles.retryBtn)}
          onClick={retry.Again}
          style={{ cursor: retry.isRetrying ? 'progress' : 'pointer' }}
        >
          {retry.isRetrying ? 'Retrying...' : 'Retry?'}
        </button>
        <code className={css(styles.errorMsg)}>{errors.message}</code>
      </div>
    )
  }
  return children
}

export default ErrorBlock
