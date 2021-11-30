/* eslint-disable no-script-url */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import { FC, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import img from '../img/404.jpg';
import { setPage } from '../slices/ControlSlice';
import { useAllMangasQuery } from '../slices/MangaApi';
import { useDispatch, useSelector } from '../store';
import { LoadingMangas } from './sub-components/Loading';
import PaginationComponent from './sub-components/Navigation';

const Reader: FC = () => {
   const [params, next] = useSearchParams(
      new URLSearchParams({
         page: '0',
      })
   );
   const mangas = useAllMangasQuery({
      page: Number(params.get('page') || 0),
   });
   const dispatch = useDispatch();
   const page = useSelector((store) => store.controls.page);
   useEffect(() => {
      if (
         mangas.isSuccess &&
         mangas.data &&
         mangas.data?.first &&
         mangas.data?.last &&
         mangas.data?.next &&
         mangas.data?.prev &&
         mangas.data?.total
      ) {
         dispatch(
            setPage({
               first: mangas.data?.first as number,
               last: mangas.data?.last as number,
               next: mangas.data?.next as number,
               prev: mangas.data?.prev as number,
               total: mangas.data?.total as number,
               current: Number(params.get('page') || 0),
            })
         );
      }
   }, [params, mangas.data, mangas.isSuccess]);
   return (
      <Container className="d-flex flex-column gap-3">
         <PaginationComponent next={next} page={page} />
         <div className="d-flex flex-wrap gap-2 justify-content-between">
            {mangas.isSuccess && !mangas.isFetching ? (
               mangas.data?.items.map((n) => (
                  <Link key={n.id} to={'/manga/' + n.id}>
                     <Card className="bg-light" style={{ width: '12rem' }}>
                        <Card.Img
                           variant="top"
                           height="180"
                           src={n.cover || img}
                        />
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
         <PaginationComponent next={next} page={page} />
      </Container>
   );
};

export default Reader;
