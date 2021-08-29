/* eslint-disable no-script-url */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import ReaderItem from './sub-components/ReaderItem';
import classname from 'classnames';
// import {
//    FaAngleLeft,
//    FaAngleRight,
//    FaAngleDoubleLeft,
//    FaAngleDoubleRight,
// } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { FC } from 'react';
import { ReaderProps } from './props';
import Loading from './sub-components/Loading';
import { useSelector } from '../store';

const Reader: FC<ReaderProps> = (props) => {
   const page = useSelector((state) => state.controls.page);
   return (
      <div className="main-reader">
         <div className="main-reader-box">
            {!props.loading && props.data ? (
               <div className={classname('main-reader-flex', 'current')}>
                  {props.data?.map((item) => (
                     <ReaderItem key={item.id} item={item} />
                  ))}
               </div>
            ) : (
               <Loading />
            )}
         </div>
      </div>
   );
};

export default Reader;
