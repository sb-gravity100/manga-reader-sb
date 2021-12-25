import classNames from 'classnames';
import { useEffect } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { AnyIfEmpty, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useToggle } from 'react-use';
import { Manga } from '../../../../src/types';
import { pushToast } from '../../slices/DownloadSlice';
import * as dl from '../../slices/DownloadSlice';
import { useGetDoujinQuery } from '../../slices/HentaiApi';
import {
   useLazySaveMangaQuery,
   useLazyRemoveMangaQuery,
} from '../../slices/MangaApi';
import { getLocale } from '../props';

type DoujinProps = {
   doujin: Manga;
   blur: any;
   refetch: any;
};

const DoujinCard: React.FC<DoujinProps> = ({ doujin: n, blur, refetch }) => {
   var [isOver, setOver] = useToggle(false);
   var thumbnail = n.thumbnail?.url;
   if (thumbnail?.match(/https?/i))
      thumbnail = `/api/fetch?url=${n.thumbnail?.url}`;
   var tagName = n.tags?.all?.find(
      (e) => e.type.match(/language/i) && !e.name.match(/translated/i)
   )?.name as string;
   var locale = getLocale(tagName);

   var handleMouseEnter = () => {
      setOver(true);
   };
   var handleMouseLeave = () => {
      setOver(false);
   };
   const dispatch = useDispatch();
   const [saveManga, saved] = useLazySaveMangaQuery({
      refetchOnFocus: false,
      refetchOnReconnect: false,
   });
   const [removeManga, removed] = useLazyRemoveMangaQuery({
      refetchOnFocus: false,
      refetchOnReconnect: false,
   });
   useEffect(() => {
      if (saved.isSuccess) {
         dispatch(
            pushToast({
               header: 'Doujin Corner',
               message: `Successfully added ${n.titles.pretty}!`,
               delay: 3000,
            })
         );
         dispatch(dl.completed(n.id));
         // refetch();
      }
      if (saved.isError) {
         dispatch(dl.error(n.id));
      }
      if (removed.isSuccess) {
         dispatch(
            pushToast({
               header: 'Doujin Corner',
               message: `Successfully removed ${n.titles.pretty}!`,
               delay: 3000,
            })
         );
         dispatch(dl.remove(n.id));
         // refetch();
      }
   }, [removed, saved, dispatch, n]);
   return (
      <Card
         className="bg-secondary position-relative"
         style={{ width: '12rem' }}
      >
         <Image
            height={20}
            width={30}
            src={locale}
            alt={tagName}
            className="position-absolute top-0 start-0"
            style={{
               zIndex: 5000,
            }}
         />
         <Card.Img
            variant="top"
            height="300"
            src={thumbnail}
            style={{
               filter: blur[0] ? 'blur(2px)' : undefined,
            }}
         />
         <div
            style={{ zIndex: 5000 }}
            className="position-absolute top-0 end-0"
         >
            <Button
               onClick={() => {
                  if (n?.availableOffline) {
                     removeManga(n.id.toString(), false);
                     dispatch(
                        pushToast({
                           header: 'Doujin Corner',
                           message: `Removing ${n?.titles.pretty}`,
                           delay: 3000,
                        })
                     );
                  } else {
                     saveManga(n.id.toString(), false);
                     dispatch(
                        pushToast({
                           header: 'Doujin Corner',
                           message: `Downloading ${n?.titles.pretty}`,
                           delay: 3000,
                        })
                     );
                     dispatch(dl.add(n.id));
                  }
               }}
               className="me-2 p-1"
               variant="primary"
            >
               <small>{n?.availableOffline ? 'Delete' : 'Download'}</small>
            </Button>
            <Link className="btn btn-danger p-1" to={`/manga/${n.id}`}>
               <small>Read</small>
            </Link>
         </div>
         <Link
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
            className="stretched-link"
            to={'/online/' + n.id}
         >
            <Card.Body className="pb-0 pt-1 position-absolute start-0 w-100 bg-dark bg-opacity-50 bottom-0">
               <Card.Title
                  style={{ fontSize: '16px', transition: '0.2s' }}
                  className={classNames(
                     'text-center text-white text-decoration-underline',
                     !isOver && 'text-truncate'
                  )}
               >
                  {n.titles.pretty}
               </Card.Title>
            </Card.Body>
         </Link>
      </Card>
   );
};

export default DoujinCard;
