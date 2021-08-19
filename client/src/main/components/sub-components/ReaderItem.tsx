/* eslint-disable jsx-a11y/alt-text */
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ReaderItemProps } from '../props';

const ReaderItem: FC<ReaderItemProps> = props => {
   const { item } = props;

   return (
      <Link className="flex-item" title={item.name} to={`/manga?id=${item.id}`}>
         {true ? (
            <img className="bg-img" src={item.cover || undefined} />
         ) : (
            <div
               className="bg-img"
               style={{
                  filter: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}>
               Loading...
            </div>
         )}
         <div className="description">
            <p>{item.name}</p>
         </div>
      </Link>
   );
};

export default ReaderItem;
