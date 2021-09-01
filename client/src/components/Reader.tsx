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
import _, { add } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { NavProps, ReaderProps } from './props';
import Loading from './sub-components/Loading';
import { useSelector } from '../store';
import QueryString from 'qs';

const CurryNav = _.curry((cur: number, max: number, addUpTo: number) => {
   const next: number[] = [];
   const prev: number[] = [];
   for (let i = cur; i < max - 1 && i < cur + addUpTo; i++) {
      next.push(i + 1);
   }
   for (let i = cur; i > 0 && i > cur - addUpTo; i--) {
      prev.push(i - 1);
   }
   return {
      next,
      prev: prev.reverse(),
   };
});

const Navigation: FC<NavProps> = (props) => {
   const addPages = 2;
   const history = useHistory();
   const location = useLocation();
   const { page, limit } = useSelector((state) => state.controls);
   const [navState, setNav] = useState(
      CurryNav(Number(page.current), page.total, addPages)
   );
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
      // props.refetch({
      //    page: _page,
      //    limit,
      // });
   };
   useEffect(() => {
      if (page.current === page.total - 1 || page.current === 0) {
         setNav(CurryNav(Number(page.current), page.total, addPages + 2));
      } else if (page.total - 1 - page.current === 1 || page.current === 1) {
         setNav(CurryNav(Number(page.current), page.total, addPages + 1));
      } else {
         setNav(CurryNav(Number(page.current), page.total, addPages));
      }
      console.log(page.total - 1 - page.current, page.current);
   }, [page]);
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
         {navState.prev.map((v) => {
            return (
               <button key={v} onClick={() => pushPage(v)}>
                  {v}
               </button>
            );
         })}
         <button className="current">{page.current}</button>
         {navState.next.map((v) => {
            return (
               <button key={v} onClick={() => pushPage(v)}>
                  {v}
               </button>
            );
         })}
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
