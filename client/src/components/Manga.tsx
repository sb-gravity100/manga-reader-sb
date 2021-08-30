import { useEffect } from 'react';
import { useSearchParam } from 'react-use';
import { ProgressBar } from 'scrolling-based-progressbar';
import MangaView from './MangaView';
import MangaHeader from './MangaHeader';
import ErrorBlock from './sub-components/ErrorBlock';
import { useGetMangaQuery } from '../slices/MangaApi';
import { useSelector } from '../store';
// import classNames from 'classnames';
import { StyleSheet, css } from 'aphrodite';
import Loading from './sub-components/Loading';

const Manga = () => {
   const mangaID = useSearchParam('id') || '';
   const {
      data: manga,
      isLoading: loading,
      error,
      refetch,
      isFetching,
   } = useGetMangaQuery(Number(mangaID));
   const controls = useSelector((state) => state.controls);
   const widthValue = (controls.zoom / 10 + 0.5) * 700;
   const styles = StyleSheet.create({
      main: {
         filter: `brightness(${controls.brightness}%)`,
         maxWidth: `${widthValue}px`,
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
         {loading && <Loading />}
         <ErrorBlock
            hasErrors={Boolean(error)}
            errors={error}
            retry={refetch}
            isFetching={isFetching}
         >
            <div className="wrapper">
               {!loading && (
                  <ProgressBar
                     height="5px"
                     bgColor="#1c2122"
                     top="30px"
                     color="#50d8d7"
                  />
               )}
               <MangaHeader
                  manga={manga}
                  zoomValue={controls.zoom}
                  brightVal={controls.brightness}
               />
               <div className={css(styles.main)} id="viewer">
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
