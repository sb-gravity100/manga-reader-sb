import { useState, useEffect } from 'react'
import { useSessionStorage } from 'react-use'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Reader from './Reader'
import ErrorBlock from './sub-components/ErrorBlock'

const Main = () => {
  const [filterValue, setFilterValue] = useState('')
  const fetchData = async () => {
    try {
      setRetry({ ...retry, isRetrying: true })
      const response = await axios.get('/list', {
        baseURL: '/api',
        timeout: 10000,
      })
      setData(response.data)
      setErrors({
          hasErrors: false,
          errors: null,
        })
    } catch (err) {
      console.log('Is it catching?')
      setRetry({ ...retry, isRetrying: false })
      setErrors({
        hasErrors: true,
        error: err,
      })
    }
  }
  const [retry, setRetry] = useState({
    Again: () => fetchData(),
    isRetrying: false,
  })
  const [errors, setErrors] = useState({
    hasErrors: false,
    error: null,
  })
  const [data, setData] = useSessionStorage('data')
  const style = {
    width: '100vw',
    height: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Helmet defer={false}>
        <title>Reader - Home</title>
        <meta name="description" content="Manga reader" />
      </Helmet>
      <h1 className="logo">
        <Link to="/" style={{ color: 'white' }}>
          <div>Reader</div>
        </Link>
      </h1>
      <input
        onChange={e => setFilterValue(e.target.value || undefined)}
        className="search-bar"
        type="search"
        placeholder="Filter"
        value={filterValue}
      />
      <ErrorBlock
        errors={errors.error}
        hasErrors={errors.hasErrors}
        retry={retry}
      >
        {data ? (
          <Reader data={data} filterValue={filterValue} />
        ) : (
          <div style={style}>Loading...</div>
        )}
      </ErrorBlock>
    </div>
  )
}
export default Main
