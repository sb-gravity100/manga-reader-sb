import { FC } from 'react';
import Image from 'react-cool-img';
import { MangaViewProps } from '../props';

const MangaView: FC<MangaViewProps> = ({ panelImg }) => (
   <div>
      <Image
         src={panelImg.path}
         alt={panelImg.name}
         error={'/kono_dio_da.png'}
         style={{ width: '100%' }}
      />
   </div>
);

export default MangaView;
