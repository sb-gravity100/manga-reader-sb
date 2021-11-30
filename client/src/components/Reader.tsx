/* eslint-disable no-script-url */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import { FC, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useAllMangasQuery } from '../slices/MangaApi';
import { LoadingMangas } from './sub-components/Loading';
import PaginationComponent from './sub-components/Navigation';

const Reader: FC = () => {
   const [params, next] = useSearchParams(
      new URLSearchParams({
         page: '0',
      })
   );
   const mangas = useAllMangasQuery({
      page: Number(params.get('page')) || 0,
   });
   return (
      <Container className="d-flex flex-column gap-2 py-2">
         <PaginationComponent next={next} page={mangas.data} />
         <div className="d-flex flex-wrap gap-2 justify-content-between">
            {mangas.isSuccess && !mangas.isFetching ? (
               mangas.data?.items.map((n) => (
                  <Link key={n.id} to={'/manga/' + n.id}>
                     <Card className="bg-light" style={{ width: '12rem' }}>
                        <Card.Img variant="top" height="190" src={n.cover} />
                        <Card.Body className="py-1 px-2">
                           <Card.Title className="fs-6 text-dark text-center text-truncate">
                              {n.name}
                           </Card.Title>
                        </Card.Body>
                     </Card>
                  </Link>
               ))
            ) : (
               <LoadingMangas />
            )}
         </div>
         <PaginationComponent next={next} page={mangas.data} />
      </Container>
   );
};

export default Reader;
