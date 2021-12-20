import { useEffect } from 'react';
import { Badge, Button, Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import { useToggle } from 'react-use';
import { Manga } from '../../../../src/types';
import { pushToast } from '../../slices/DownloadSlice';
import { useGetDoujinQuery } from '../../slices/HentaiApi';
import {
   useLazyRemoveMangaQuery,
   useLazySaveMangaQuery,
} from '../../slices/MangaApi';
import { useDispatch } from '../../store';
import timeAgo from '../../timeAgo';

const TagButton: React.FC<{ type: string; doujin?: Manga }> = ({
   doujin,
   type,
   children,
}) => {
   var [isNone, setNone] = useToggle(false);

   useEffect(() => {
      if (doujin?.tags.all.filter((e) => e.type === type).length < 1) {
         setNone(true);
      }
   }, [doujin?.tags.all, setNone, type]);
   if (isNone) {
      return <></>;
   }
   return (
      <div className="bg-light bg-opacity-75 text-dark rounded p-2 shadow">
         <span className="d-inline-flex gap-2 flex-wrap align-items-center">
            <span className="fw-bold">{children}</span>
            {doujin?.tags.all
               .filter((e) => e.type === type)
               .map((e) => {
                  console.log(e.url);
                  return (
                     <a
                        key={e.id}
                        className="btn btn-outline-secondary py-1 px-2"
                        href={e.url}
                        target="_blank"
                     >
                        <span className="fst-italic me-2">{e.name}</span>
                        <Badge bg="secondary">{e.count}</Badge>
                     </a>
                  );
               })}
         </span>
      </div>
   );
};

const DoujinPage: React.FC = (props) => {
   const { id } = useParams();
   const doujin = useGetDoujinQuery(id as string);
   const dispatch = useDispatch();
   const [saveManga, saved] = useLazySaveMangaQuery({
      refetchOnFocus: false,
      refetchOnReconnect: false,
   });
   const [removeManga, removed] = useLazyRemoveMangaQuery({
      refetchOnFocus: false,
      refetchOnReconnect: false,
   });
   const showTitle = () => {
      var splitted = doujin.data?.titles.english.split(
         doujin.data?.titles.pretty
      ) as string[];
      return (
         <>
            <span className="fst-italic">{splitted[0]}</span>
            <span className="fw-bold">{doujin.data?.titles.pretty}</span>{' '}
            <span className="fst-italic">{splitted[1]}</span>
         </>
      );
   };

   useEffect(() => {
      if (saved.isSuccess) {
         dispatch(
            pushToast({
               header: 'Doujin Corner',
               message: `Successfully added ${doujin.data?.titles.pretty}!`,
               delay: 3000,
            })
         );
         doujin.refetch();
      }
      if (removed.isSuccess) {
         dispatch(
            pushToast({
               header: 'Doujin Corner',
               message: `Successfully removed ${doujin.data?.titles.pretty}!`,
               delay: 3000,
            })
         );
         doujin.refetch();
      }
   }, [removed, saved, dispatch, doujin.data?.titles.pretty]);
   return (
      <Container className="w-75 py-4 bg-secondary bg-opacity-50 shadow rounded-2 my-3">
         {doujin.isSuccess && (
            <Row className="text-light">
               <Col xs={5}>
                  <div className="position-relative">
                     <Link to={`/manga/${doujin.data.id}`}>
                        <Image
                           rounded
                           style={{ width: '100%', filter: 'blur(3px)' }}
                           src={`/api/fetch?url=${doujin.data?.cover.url}`}
                        />
                     </Link>
                     <div className="position-absolute top-0 start-0">
                        <Button
                           onClick={() => {
                              if (doujin.data?.availableOffline) {
                                 removeManga(doujin.data.id.toString(), false);
                                 dispatch(
                                    pushToast({
                                       header: 'Doujin Corner',
                                       message: `Removing ${doujin.data?.titles.pretty}`,
                                       delay: 3000,
                                    })
                                 );
                              } else {
                                 saveManga(doujin.data.id.toString(), false);
                                 dispatch(
                                    pushToast({
                                       header: 'Doujin Corner',
                                       message: `Downloading ${doujin.data?.titles.pretty}`,
                                       delay: 3000,
                                    })
                                 );
                              }
                           }}
                           className="me-2"
                           variant="primary"
                        >
                           {doujin.data?.availableOffline
                              ? 'Delete'
                              : 'Download'}
                        </Button>
                        <Link
                           className="btn btn-danger"
                           to={`/manga/${doujin.data.id}`}
                        >
                           Read
                        </Link>
                     </div>
                  </div>
               </Col>
               <Col className="py-2 d-flex flex-wrap align-items-start align-content-start gap-3">
                  <div className="lead bg-gradient bg-light bg-opacity-50 text-black rounded p-2 shadow flex-fill">
                     {showTitle()}
                  </div>
                  <TagButton type="tag" doujin={doujin.data}>
                     Tags:
                  </TagButton>
                  <TagButton type="artist" doujin={doujin.data}>
                     Artists:
                  </TagButton>
                  <TagButton type="group" doujin={doujin.data}>
                     Groups:
                  </TagButton>
                  <TagButton type="language" doujin={doujin.data}>
                     Languages:
                  </TagButton>
                  <TagButton type="category" doujin={doujin.data}>
                     Categories:
                  </TagButton>
                  <div className="bg-light bg-opacity-75 text-dark rounded p-2 shadow">
                     <span className="fw-bold me-1 align-middle">Pages:</span>
                     <span className="btn btn-outline-secondary py-1">
                        {doujin.data?.length}
                     </span>
                  </div>
                  <div className="bg-light bg-opacity-75 text-dark rounded p-2 shadow">
                     <span className="fw-bold me-1 align-middle">
                        Uploaded:{' '}
                     </span>
                     <span className="btn btn-outline-secondary py-1">
                        {timeAgo.format(
                           new Date(doujin.data?.uploadDate),
                           'round-minute'
                        )}
                     </span>
                  </div>
               </Col>
            </Row>
         )}
      </Container>
   );
};

export default DoujinPage;
