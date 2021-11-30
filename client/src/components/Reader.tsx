/* eslint-disable no-script-url */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';
import { Card, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useAllMangasQuery } from '../slices/MangaApi';
import { LoadingMangas } from './sub-components/Loading';
import PaginationComponent from './sub-components/Navigation';

const Reader: FC = () => {
   const [refresh, setRefresh] = useState('');
   const [params, next] = useSearchParams(
      new URLSearchParams({
         page: '0',
         refresh,
      })
   );
   const mangas = useAllMangasQuery({
      page: Number(params.get('page')) || 0,
      refresh,
   });
   useEffect(() => {
      setRefresh('');
      console.log('done refresh');
   }, [refresh]);
   return (
      <Container className="d-flex flex-column gap-2 py-2">
         <PaginationComponent
            refresh={() => {
               setRefresh('true');
               mangas.refetch();
            }}
            next={next}
            page={mangas.data}
         />
         <div className="d-flex flex-wrap gap-2 justify-content-between">
            {mangas.isSuccess && !mangas.isFetching ? (
               mangas.data?.items.map((n) => (
                  <Card
                     key={n.id}
                     className="bg-secondary"
                     style={{ width: '12rem' }}
                  >
                     <Card.Img variant="top" height="200" src={n.cover} />
                     <Card.Body className="pb-0 pt-1">
                        <OverlayTrigger overlay={<Tooltip>{n.name}</Tooltip>}>
                           <Link
                              className="stretched-link"
                              to={'/manga/' + n.id}
                           >
                              <Card.Text
                                 style={{ fontSize: '13px' }}
                                 className="text-center text-truncate"
                              >
                                 {n.name}
                              </Card.Text>
                           </Link>
                        </OverlayTrigger>
                     </Card.Body>
                  </Card>
               ))
            ) : (
               <LoadingMangas />
            )}
         </div>
         <PaginationComponent
            refresh={() => {
               setRefresh('true');
               mangas.refetch();
            }}
            next={next}
            page={mangas.data}
         />
      </Container>
   );
};

export default Reader;
