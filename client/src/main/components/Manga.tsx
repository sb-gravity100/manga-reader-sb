import { useEffect } from 'react';
import { useLocalStorage, useSearchParam } from 'react-use';
import { css, StyleSheet } from 'aphrodite';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'scrolling-based-progressbar';
import MangaView from './MangaView';
import { useSpring, animated as anim } from 'react-spring';
import * as Scroll from 'react-scroll';
import MangaHeader from './MangaHeader';
import ErrorBlock from './sub-components/ErrorBlock';
import styles from '../style.module.scss';
import { useGetMangaQuery } from '../../types';

const scroll = Scroll.animateScroll;

const Manga = () => {
   const location = useLocation();
   const mangaID = useSearchParam('id') || '';
   const { loading, data, error, refetch } = useGetMangaQuery({
      variables: {
         id: mangaID,
      },
   });
   const [zoomValue, setZoomVal] = useLocalStorage<number>('zoomValue', 5);
   const [brightVal, setBright] = useLocalStorage<number>('brightValue', 100);
   const loading_props = {
      text: useSpring({
         from: {
            opacity: 1,
         },
         opacity: 0,
         loop: { reverse: true },
         reset: loading,
      })
   };
   const viewerStyles = StyleSheet.create({
      brightnessAdjust: {
         filter: `brightness(${brightVal}%)`,
      },
      widthAdjust: {
         maxWidth: `${((zoomValue || 5) / 10 + 0.5) * 700}px`,
         transition: '0.3s',
      },
   });

   useEffect(() => {
      if (loading) {
         document.title = 'Loading...';
      } else {
         if (data?.manga) {
            document.title = data.manga.name;
         }
      }
   });

   useEffect(() => {
      scroll.scrollToTop();
   }, []);

   return (
      <div>
         {loading && (
            <div className={styles.loading_style}>
               <h3>
                  <anim.span style={loading_props.text}>Loading...</anim.span>
               </h3>
            </div>
         )}
         <ErrorBlock
            loading={loading}
            hasErrors={Boolean(error)}
            errors={error}
            retry={refetch}>
            <div className="wrapper">
               {!loading && (
                  <ProgressBar
                     height="3px"
                     top="30px"
                     color="#546"
                     bgColor="#aae"
                  />
               )}
               <MangaHeader
                  manga={!loading && data?.manga}
                  zoomValue={zoomValue}
                  brightVal={brightVal}
                  setBright={setBright}
                  setZoomVal={setZoomVal}
               />
               <div
                  className={css(
                     viewerStyles.brightnessAdjust,
                     viewerStyles.widthAdjust
                  )}
                  id="viewer">
                  {!loading &&
                     data?.manga?.data?.map((d, k: number) => (
                        <MangaView key={k} panelImg={d} />
                     ))}
               </div>
            </div>
         </ErrorBlock>
      </div>
   );
};

export default Manga;
