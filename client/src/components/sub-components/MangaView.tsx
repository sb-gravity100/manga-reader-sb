import { Image } from 'react-bootstrap';
import { MangaViewProps } from '../props';

const MangaView: React.FC<MangaViewProps> = (props) => {
   return (
      <div>
         <Image
            src={props.src}
            alt={props.img.pageNumber + '.' + props.img.extension}
            style={{ width: '100%' }}
            className="rounded"
         />
      </div>
   );
};

export default MangaView;
