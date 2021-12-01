import { useEffect } from 'react';
import { useGetMangaQuery } from '../slices/MangaApi';
// import classNames from 'classnames';
import NotFound from './sub-components/404';
import { LoadingScreen } from './sub-components/Loading';
import { useParams } from 'react-router';
import { Image } from 'react-bootstrap';

const Manga = () => {
   var { id } = useParams();
   const manga = useGetMangaQuery(id as string);

   if (typeof id === 'undefined' || manga.isError) {
      return <NotFound />;
   }
   return (
      <div className="container" style={{ height: '100vh' }}>
         {manga.isLoading && <LoadingScreen />}
         <div className="h-100 d-flex flex-column align-items-center">
            {manga.isSuccess &&
               manga.data.data?.map((e) => (
                  <div key={e.name}>
                     <Image src={e.path} key={e.name} alt={e.name} />
                  </div>
               ))}
         </div>
      </div>
   );
};

export default Manga;
