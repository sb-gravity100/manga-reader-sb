import { FC } from 'react';
import { useMedia } from 'react-use';
import { Image } from 'react-bootstrap';
import { MangaViewProps } from '../props';

const MangaView: FC<MangaViewProps> = (props) => {
   return (
      <div>
         <Image
            src={props.src}
            alt={props.img.url}
            style={{ width: '100%' }}
            className="rounded"
         />
      </div>
   );
};

export default MangaView;
