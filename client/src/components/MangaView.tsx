import { FC } from 'react';
import Image from 'react-cool-img';
import { MangaViewProps } from './props';

const MangaView: FC<MangaViewProps> = ({ panelImg }) => (
   <div className="panel">
      <Image
         src={panelImg.path}
         alt={panelImg.name}
         error={'/404.jpg'}
         style={!panelImg ? { background: '#444', height: '500px' } : {}}
      />
   </div>
);

export default MangaView;
