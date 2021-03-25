import { Helmet } from 'react-helmet'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useSessionStorage } from 'react-use'
import { css, StyleSheet } from 'aphrodite'
import { Route, useLocation } from 'react-router-dom'
import { ProgressBar } from 'scrolling-based-progressbar'
import MangaView from './MangaView'
import MangaHeader from './MangaHeader'
import ErrorBlock from './sub-components/ErrorBlock'

const Manga = () => {
  const [manga, setManga] = useSessionStorage('mangaData')
  const [errors, setErrors] = useState({
    hasErrors: false,
    error: null,
  })
  const [retry, setRetry] = useState({
    Again: () => getMangaData(),
    isRetrying: false,
  })
  const [zoomValue, setZoomVal] = useState(5)
  const [brightVal, setBright] = useState(100)
  const location = useLocation()
  const source = axios.CancelToken.source()
  const viewerStyles = StyleSheet.create({
    brightnessAdjust: {
      filter: `brightness(${brightVal}%)`,
    },
    widthAdjust: {
      maxWidth: `${(zoomValue / 10 + 0.5) * 700}px`,
      transition: '0.3s',
    },
  })

  const getMangaData = async () => {
    try {
      setErrors({
        hasErrors: false,
        error: null,
      })
      setRetry({
        ...retry,
        isRetrying: true,
      })
      setManga(null)
      const { data } = await axios.get(location.pathname, {
        baseURL: '/api',
        responseType: 'json',
      })
      setManga(data)
    } catch (e) {
      setRetry({
        ...retry,
        isRetrying: false,
      })
      setErrors({
        hasErrors: true,
        error: e,
      })
    }
  }

  useEffect(() => {
    getMangaData()
  }, [])

  return (
    <div>
      <Helmet defer={false}>
        <title>{manga && manga.name}</title>
        <meta name="description" content={manga && manga.name} />
      </Helmet>
      <Route path="/:id">
        <ErrorBlock
          errors={errors.error}
          hasErrors={errors.hasErrors}
          retry={retry}
        >
          <ProgressBar height="3px" top="30px" color="#546" bgColor="#aae" />
          <div className="wrapper">
            <MangaHeader
              manga={manga}
              zoomValue={zoomValue}
              brightVal={brightVal}
              setBright={setBright}
              setZoomVal={setZoomVal}
            />
            <div
              className={css(
                viewerStyles.brightnessAdjust,
                viewerStyles.widthAdjust,
              )}
              id="viewer"
            >
              {manga &&
                manga.data.map(panel => (
                  <MangaView key={parseInt(panel.name)} panelImg={panel} />
                ))}
            </div>
          </div>
        </ErrorBlock>
      </Route>
    </div>
  )
}

export default Manga
