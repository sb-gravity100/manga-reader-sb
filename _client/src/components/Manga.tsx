import { useEffect } from 'react';
import { useSearchParam } from 'react-use';
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
      isError,
   } = useGetMangaQuery(Number(mangaID));
   const controls = useSelector((state) => state.controls);
   const widthValue = (controls.zoom / 10 + 0.5) * 700;
   const styles = StyleSheet.create({
      main: {
         filter: controls.brightness ? 'brightness(100%)' : 'brightness(60%)',
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
      <div className="manga-container">
         {loading && <Loading />}
         <ErrorBlock
            hasErrors={isError}
            errors={error}
            retry={refetch}
            isFetching={isFetching}
         >
            <div className="wrapper">
               <MangaHeader manga={manga} />
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
