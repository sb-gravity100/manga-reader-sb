import { useState, useEffect } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'scrolling-based-progressbar';
import { useQuery } from '@apollo/client';
import MangaView from './MangaView';
import { useSpring, animated as anim } from 'react-spring';
import * as Scroll from 'react-scroll';
import MangaHeader from './MangaHeader';
import ErrorBlock from './sub-components/ErrorBlock';
import { GET_MANGA } from '../data/queries';
import styles from '../css_modules/main.module.scss';

const scroll = Scroll.animateScroll;
const ScrollEvents = Scroll.Events;

const Manga = () => {
   const [zoomValue, setZoomVal] = useState(5);
   const [brightVal, setBright] = useState(100);
   const loading_props = {
      text: useSpring({
         from: {
            opacity: 1,
         },
         opacity: 0,
         loop: { reverse: true },
      }),
   };
   const location = useLocation();
   const mangaID = new URLSearchParams(location.search).get('id');
   const { loading, data, error, refetch } = useQuery(GET_MANGA, {
      variables: {
         id: mangaID,
      },
   });
   const scrollDown = () => {
      scroll.scrollToBottom({
         duration: d => {
            return d * 200;
         },
         delay: 500,
         smooth: 'linear'
      });
   };
   const viewerStyles = StyleSheet.create({
      brightnessAdjust: {
         filter: `brightness(${brightVal}%)`,
      },
      widthAdjust: {
         maxWidth: `${(zoomValue / 10 + 0.5) * 700}px`,
         transition: '0.3s',
      },
   });

   useEffect(() => {
      ScrollEvents.scrollEvent.register('begin', (to, el) => {
         console.log('begin', to, el);
      });
      ScrollEvents.scrollEvent.register('end', (to, el) => {
         console.log('end', to, el);
      });
      scroll.scrollToTop();
   });

   return (
      <div>
         <ErrorBlock hasErrors={error && true} errors={error} retry={refetch}>
            <div className="wrapper">
               <ProgressBar
                  height="3px"
                  top="30px"
                  color="#546"
                  bgColor="#aae"
               />
               <MangaHeader
                  manga={!loading && data.manga}
                  zoomValue={zoomValue}
                  brightVal={brightVal}
                  setBright={setBright}
                  setZoomVal={setZoomVal}
                  scrollDown={scrollDown}
               />
               <div
                  className={css(
                     viewerStyles.brightnessAdjust,
                     viewerStyles.widthAdjust
                  )}
                  id="viewer">
                  {loading ? (
                     <div
                        style={{ flexGrow: 1 }}
                        className={styles.loading_style}>
                        <h3>
                           <anim.span style={loading_props.text}>
                              Loading...
                           </anim.span>
                        </h3>
                     </div>
                  ) : (
                     data.manga.data.map((d, k) => (
                        <MangaView key={k} panelImg={d} />
                     ))
                  )}
               </div>
            </div>
         </ErrorBlock>
      </div>
   );
};

export default Manga;
