import { useEffect } from 'react';
import { useLocalStorage, useSearchParam } from 'react-use';
import { css, StyleSheet } from 'aphrodite';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'scrolling-based-progressbar';
import MangaView from './MangaView';
import { useSpring, animated as anim } from 'react-spring';
import MangaHeader from './MangaHeader';
import ErrorBlock from './sub-components/ErrorBlock';
import styles from '../style.module.scss';
import { useGetMangaQuery } from '../slices/MangaApi';

const Manga = () => {
   const mangaID = useSearchParam('id') || '';
   const {
      data: manga,
      isLoading: loading,
      error,
      refetch,
      isFetching,
   } = useGetMangaQuery(Number(mangaID));
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
      }),
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
         if (manga) {
            document.title = manga?.name;
         }
      }
   });

   useEffect(() => {
      window.scroll({
         top: 0,
         left: 0,
      });
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
            hasErrors={Boolean(error)}
            errors={error}
            retry={refetch}
            isFetching={isFetching}
         >
            <div className="wrapper">
               {!loading && (
                  <ProgressBar
                     height="10px"
                     color="#aae"
                     top="30px"
                     bgColor="#546"
                  />
               )}
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
                     viewerStyles.widthAdjust
                  )}
                  id="viewer"
               >
                  {!loading &&
                     manga?.data?.map((d, k: number) => (
                        <MangaView key={k} panelImg={d} />
                     ))}
               </div>
            </div>
         </ErrorBlock>
      </div>
   );
};

export default Manga;
