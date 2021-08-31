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
import { FC, useEffect } from 'react';
import { NavProps, ReaderProps } from './props';
import Loading from './sub-components/Loading';
import { useDispatch, useSelector } from '../store';
import QueryString from 'qs';
import { current } from '@reduxjs/toolkit';
import { setPage } from '../slices/ControlSlice';
import { useSearchParam } from 'react-use';

const Navigation: FC<NavProps> = (props) => {
   const history = useHistory();
   const location = useLocation();
   const page = useSelector((state) => state.controls.page);
   const pushPage = (_page: number) => {
      const currentParams = QueryString.parse(location.search.slice(1));
      history.push({
         search:
            '?' +
            QueryString.stringify(
               Object.assign(currentParams, {
                  page: _page,
               })
            ),
      });
   };
   return (
      <div className="nav">
         <button
            disabled={
               typeof page.first !== 'number' || page.current === page.first
            }
            onClick={() => pushPage(page.first)}
         >
            <FaAngleDoubleLeft />
         </button>
         <button
            disabled={
               typeof page.prev !== 'number' || page.current === page.first
            }
            onClick={() => pushPage(page.prev)}
         >
            <FaAngleLeft />
         </button>
         <button
            disabled={
               typeof page.next !== 'number' || page.current === page.last
            }
            onClick={() => pushPage(page.next)}
         >
            <FaAngleRight />
         </button>
         <button
            disabled={
               typeof page.last !== 'number' || page.current === page.last
            }
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
         <Navigation refetch={props.refetch} />
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
