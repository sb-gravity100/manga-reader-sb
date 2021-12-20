import { Doujin, TagManager } from 'nhentai';
import { Card, OverlayTrigger, Tooltip, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getLocale } from '../props';

type DoujinProps = {
   doujin: Doujin;
   blur: any;
};

const DoujinCard: React.FC<DoujinProps> = ({ doujin: n, blur }) => {
   var thumbnail = n.thumbnail.url;
   if (thumbnail.match(/https?/i))
      thumbnail = `/api/fetch?url=${n.thumbnail.url}`;
   var tagName = n.tags.all.find(
      (e) => e.type.match(/language/i) && !e.name.match(/translated/i)
   )?.name as string;
   var locale = getLocale(tagName);
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
               zIndex: 9999,
            }}
         />
         <Card.Img
            variant="top"
            height="200"
            src={thumbnail}
            style={{
               filter: blur[0] ? 'blur(2px)' : undefined,
            }}
         />
         <Card.Body className="pb-0 pt-1">
            <OverlayTrigger
               placement="auto"
               overlay={<Tooltip>{n.titles.pretty}</Tooltip>}
            >
               <Link className="stretched-link" to={'/online/' + n.id}>
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
};

export default DoujinCard;
