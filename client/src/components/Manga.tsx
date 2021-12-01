import { useEffect, useState } from 'react';
import { useGetMangaQuery } from '../slices/MangaApi';
// import classNames from 'classnames';
import NotFound from './sub-components/404';
import { LoadingScreen } from './sub-components/Loading';
import { useParams } from 'react-router';
import { Image } from 'react-bootstrap';
import MangaHeader from './sub-components/MangaHeader';
import MangaView from './sub-components/MangaView';

const Manga = () => {
   var { id } = useParams();
   var manga = useGetMangaQuery(id as string);
   var [zoomValue, setZoom] = useState('');
   var [brightValue, setBright] = useState('');

   if (typeof id === 'undefined' || manga.isError) {
      return <NotFound />;
   }
   return (
      <div className="container-fluid" style={{ height: '100vh' }}>
         {manga.isLoading && <LoadingScreen />}
         <MangaHeader setZoom={setZoom} setBright={setBright} />
         <div
            style={{ width: zoomValue, filter: brightValue }}
            className="mx-auto d-flex flex-column align-items-center"
         >
            {manga.isSuccess &&
               manga.data.data?.map((e) => (
                  <MangaView key={e.name} panelImg={e} />
               ))}
         </div>
      </div>
   );
};

export default Manga;
