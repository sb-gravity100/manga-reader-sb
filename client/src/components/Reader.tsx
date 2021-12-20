import _ from 'lodash';
import { FC } from 'react';
import { Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useToggle } from 'react-use';
import { useAllMangasQuery } from '../slices/MangaApi';
import { LoadingMangas } from './sub-components/Loading';
import PaginationComponent from './sub-components/Navigation';
import DoujinCard from './sub-components/DoujinCard';

const Reader: FC = () => {
   const blur = useToggle(true);
   const [params, next] = useSearchParams(
      new URLSearchParams({
         page: '1',
      })
   );
   const mangas = useAllMangasQuery({
      page: params.get('page') || 1,
   });
   var PageComp = () => (
      <PaginationComponent
         refresh={() => {
            mangas.refetch();
         }}
         next={next}
         page={mangas?.data}
         blur={blur}
         current={Number(params.get('page') || 1)}
      />
   );
   return (
      <Container className="d-flex flex-column gap-2 py-2">
         <PageComp />
         <div className="d-flex flex-wrap gap-2 justify-content-center">
            {mangas.isSuccess && !mangas.isFetching ? (
               mangas.data?.doujins.map((n) => {
                  return <DoujinCard key={n.id} doujin={n} blur={blur} />;
               })
            ) : (
               <LoadingMangas />
            )}
         </div>
         <PageComp />
      </Container>
   );
};

export default Reader;
