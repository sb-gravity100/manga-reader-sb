import { FC } from 'react';
import Image from 'react-cool-img';
import errorImg from '../img/404.jpg';
import { MangaViewProps } from './props';

const MangaView: FC<MangaViewProps> = ({ panelImg }) => (
   <div className="panel">
      <Image
         src={`/${panelImg.path}`}
         alt={panelImg.name}
         error={errorImg}
         style={!panelImg ? { background: '#444', height: '500px' } : {}}
      />
   </div>
);

export default MangaView;
