/* eslint-disable no-script-url */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import ReaderItem from './sub-components/ReaderItem';
import classname from 'classnames';
import {
   FaAngleLeft,
   FaAngleRight,
   FaAngleDoubleLeft,
   FaAngleDoubleRight,
} from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router-dom';
import _ from 'lodash';
import { FC } from 'react';
import { ReaderProps } from './props';
import Loading from './sub-components/Loading';
import { useSelector } from '../store';
import QueryString from 'qs';
import { current } from '@reduxjs/toolkit';

const Navigation: FC = (props) => {
   const page = useSelector((state) => state.controls.page);
   const history = useHistory();
   const pushPage = (page: any) => {
      const currentParams = QueryString.parse(history.location.search.slice(1));
      history.push({
         search:
            '?' +
            QueryString.stringify(
               _.merge(currentParams, {
                  page,
               })
            ),
      });
   };
   return (
      <div className="nav">
         <button
            disabled={_.isUndefined(page.first) || page.current === page.first}
            onClick={() => pushPage(page.first)}
         >
            <FaAngleDoubleLeft />
         </button>
         <button
            disabled={_.isUndefined(page.next) || page.current === page.first}
            onClick={() => pushPage(page.prev)}
         >
            <FaAngleLeft />
         </button>
         <button
            disabled={_.isUndefined(page.next) || page.current === page.last}
            onClick={() => pushPage(page.next)}
         >
            <FaAngleRight />
         </button>
         <button
            disabled={_.isUndefined(page.last) || page.current === page.last}
            onClick={() => pushPage(page.last)}
         >
            <FaAngleDoubleRight />
         </button>
      </div>
   );
};

const Reader: FC<ReaderProps> = (props) => {
   return (
      <div className="main-reader">
         <Navigation />
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
