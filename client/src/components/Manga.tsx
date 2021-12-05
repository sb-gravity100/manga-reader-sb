import { useEffect, useState } from 'react';
import { useGetMangaQuery } from '../slices/MangaApi';
// import classNames from 'classnames';
import NotFound from './sub-components/404';
import { LoadingScreen } from './sub-components/Loading';
import { useParams } from 'react-router';
import { Image, ProgressBar } from 'react-bootstrap';
import MangaHeader from './sub-components/MangaHeader';
import MangaView from './sub-components/MangaView';
import { useEvent } from 'react-use';

const Manga = () => {
   var { id } = useParams();
   var manga = useGetMangaQuery(id as string);
   var [scrollProgress, setProgress] = useState(
      window.scrollY / (document.body.scrollHeight - window.innerHeight)
   );
   var [zoomValue, setZoom] = useState('');
   var [brightValue, setBright] = useState('');
   var [lastZoomPercent, setZoomPercent] = useState(
      window.scrollY / (document.body.scrollHeight - window.innerHeight)
   );

   useEvent('scroll', () => {
      setProgress(
         (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
            100
      );
   });

   useEffect(() => {
      // console.log('zoom change');
      setZoomPercent(
         window.scrollY / (document.body.scrollHeight - window.innerHeight)
      );
   }, [zoomValue]);

   if (manga.isFetching) {
      document.title = 'Loading...';
   }

   useEffect(() => {
      if (manga.isSuccess) {
         document.title = manga.data.name;
      }
   }, [manga.data?.name, manga.isSuccess]);

   if (typeof id === 'undefined' || manga.isError) {
      return <NotFound />;
   }
   return (
      <>
         {manga.isSuccess && (
            <ProgressBar
               style={{
                  height: '5px',
                  width: '100vh !important',
                  zIndex: 9999,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  transition: '0.1s',
               }}
               className="rounded-0 w-100"
               now={scrollProgress}
            />
         )}
         <div className="container-fluid" style={{ height: '100vh' }}>
            {manga.isLoading && <LoadingScreen />}
            <MangaHeader
               setZoom={setZoom}
               setBright={setBright}
               manga={manga.data}
            />
            <div
               style={{
                  maxWidth: zoomValue,
                  filter: brightValue,
                  transition: 'width 0.05s',
               }}
               onTransitionEnd={() => {
                  window.scrollTo(
                     0,
                     (document.body.scrollHeight - window.innerHeight) *
                        lastZoomPercent
                  );
                  console.log(
                     window.scrollY /
                        (document.body.scrollHeight - window.innerHeight)
                  );
                  // console.log('end');
               }}
               className="mx-auto d-flex flex-column align-items-stretch gap-2 mt-2"
            >
               {manga.isSuccess &&
                  manga.data.data?.map((e) => (
                     <MangaView key={e.name} panelImg={e} />
                  ))}
            </div>
         </div>
      </>
   );
};

export default Manga;
