/* eslint-disable no-script-url */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';
import {
   Card,
   Col,
   Container,
   Placeholder,
   Pagination,
   Stack,
} from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import img from '../img/404.jpg';
import { setPage } from '../slices/ControlSlice';
import { useAllMangasQuery } from '../slices/MangaApi';
import { useDispatch, useSelector } from '../store';

interface PPage {
   page: any;
   next: any;
}

const PageNav: FC<PPage> = ({ page, next }) => {
   return (
      <Pagination className="justify-content-center m-0">
         <Pagination.First
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page.first as any,
                  })
               )
            }
         />
         <Pagination.Prev
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page.prev as any,
                  })
               )
            }
         />
         {_.times(10, (n) => (
            <Pagination.Item
               onClick={() =>
                  next(
                     new URLSearchParams({
                        page: n as any,
                     })
                  )
               }
               key={n}
               active={page.current === n}
            >
               {n + 1}
            </Pagination.Item>
         ))}
         <Pagination.Next />
         <Pagination.Last />
      </Pagination>
   );
};

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
   }, [params]);
   return (
      <Container className="d-flex flex-column gap-3">
         <PageNav next={next} page={page} />
         <div className="d-flex h-auto flex-wrap gap-2 align-items-center justify-content-between">
            {mangas.isSuccess &&
               mangas.data?.items.map((n) => (
                  <Link to={'/manga/' + n.id}>
                     <Card
                        key={n.id}
                        className="bg-light"
                        style={{ width: '12rem' }}
                     >
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
               ))}
         </div>
         <PageNav next={next} page={page} />
      </Container>
   );
};

export default Reader;
