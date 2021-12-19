/* eslint-disable no-script-url */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import { FC } from 'react';
import { Card, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useToggle } from 'react-use';
import path from 'path';
import { useAllMangasQuery } from '../slices/MangaApi';
import { LoadingMangas } from './sub-components/Loading';
import PaginationComponent from './sub-components/Navigation';

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
         <div className="d-flex flex-wrap gap-2 justify-content-between">
            {mangas.isSuccess && !mangas.isFetching ? (
               mangas.data?.doujins.map((n) => {
                  var cover = n.cover.url;
                  return (
                     <Card
                        key={n.id}
                        className="bg-secondary"
                        style={{ width: '12rem' }}
                     >
                        <Card.Img
                           variant="top"
                           height="200"
                           src={cover}
                           style={{
                              filter: blur[0] ? 'blur(2px)' : undefined,
                              overflow: 'hidden',
                           }}
                        />
                        <Card.Body className="pb-0 pt-1">
                           <OverlayTrigger
                              placement="auto"
                              overlay={<Tooltip>{n.titles.pretty}</Tooltip>}
                           >
                              <Link
                                 className="stretched-link"
                                 to={'/manga/' + n.id}
                              >
                                 <Card.Title
                                    style={{ fontSize: '13px' }}
                                    className="text-center text-truncate"
                                 >
                                    {n.titles.pretty}
                                 </Card.Title>
                              </Link>
                           </OverlayTrigger>
                        </Card.Body>
                     </Card>
                  );
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
