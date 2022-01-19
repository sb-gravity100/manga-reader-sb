import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useToggle } from 'react-use';
import { Manga } from '../../../../src/types';
import { FaDownload, FaBookOpen, FaMinus } from 'react-icons/fa';
import {
   useLazySaveMangaQuery,
   useLazyRemoveMangaQuery,
} from '../../slices/MangaApi';
import { getLocale } from '../props';
import { Badge } from 'react-bootstrap';

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
   var tags = useMemo(
      () => n.tags?.all.filter((e) => e.type === 'tag'),
      [n.tags?.all]
   );
   var locale = getLocale(tagName);

   var handleMouseEnter = () => {
      setOver(true);
   };
   var handleMouseLeave = () => {
      setOver(false);
   };
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
         refetch();
      }
   }, [saved, n, refetch]);
   useEffect(() => {
      if (removed.isSuccess) {
         refetch();
      }
   }, [removed, n, refetch]);
   return (
      <Card
         onMouseOver={handleMouseEnter}
         onMouseOut={handleMouseLeave}
         className="bg-secondary position-relative"
         style={{ width: '12rem' }}
      >
         {locale && (
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
         )}
         <Link to={'/online/' + n.id}>
            <Card.Img
               variant="top"
               height="300"
               src={thumbnail}
               style={{
                  filter: blur[0] ? 'blur(2px)' : undefined,
               }}
            />
         </Link>
         <div
            style={{ zIndex: 5000 }}
            className="position-absolute top-0 end-0"
         >
            <Button
               onClick={() => {
                  if (n?.availableOffline) {
                     removeManga(n.id.toString(), false);
                  } else {
                     saveManga(n.id.toString(), false);
                  }
               }}
               className="me-2 py-1 px-2"
               variant="primary"
            >
               {n?.availableOffline ? <FaMinus /> : <FaDownload />}
            </Button>
            <Link className="btn btn-danger py-1 px-2" to={`/manga/${n.id}`}>
               <FaBookOpen />
            </Link>
         </div>
         <Card.Body className="pb-0 pt-1 position-absolute start-0 w-100 bg-dark bg-opacity-50 bottom-0">
            <Card.Title
               style={{
                  fontSize: '16px',
               }}
               className={classNames(
                  'text-center text-white text-decoration-underline',
                  !isOver && 'text-truncate'
               )}
            >
               <Link className="text-light" to={'/online/' + n.id}>
                  {n.titles.pretty}{' '}
               </Link>
               {isOver && (
                  <div
                     onMouseOver={handleMouseEnter}
                     onMouseOut={handleMouseLeave}
                  >
                     <div className="mt-1 d-flex flex-wrap align-items-center justify-content-around">
                        {tags.map((e) => (
                           <Badge className="bg-opacity-50" bg="dark">
                              {e.name}
                           </Badge>
                        ))}
                     </div>
                     <div className="mt-1">
                        <Badge className="bg-opacity-50" bg="primary">
                           {n.tags?.all?.find((e) => e.type === 'artist')
                              ?.name || 'Anonymous'}
                        </Badge>
                     </div>
                  </div>
               )}
            </Card.Title>
         </Card.Body>
      </Card>
   );
};

export default DoujinCard;
