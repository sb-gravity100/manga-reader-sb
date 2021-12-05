import { FC } from 'react';
import { useMedia } from 'react-use';
import { Image } from 'react-bootstrap';
import { MangaViewProps } from '../props';

const MangaView: FC<MangaViewProps> = ({ panelImg }) => {
   // var img =
   return (
      <div>
         <Image
            src={panelImg.path}
            alt={panelImg.name}
            style={{ width: '100%' }}
            className="rounded"
         />
      </div>
   );
};

export default MangaView;
