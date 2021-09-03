import { Link, useLocation } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import { FC, MouseEventHandler } from 'react';
import Reader from './Reader';
import ErrorBlock from './sub-components/ErrorBlock';
import { useState, useEffect, ChangeEventHandler } from 'react';
import styles from '../style.module.scss';
import {
   useAllMangasQuery,
   useLazyAllMangasQuery,
   useSearchQuery,
} from '../slices/MangaApi';
import { useDispatch, useSelector } from '../store';
import { setPage, setSearch, toggleBlur } from '../slices/ControlSlice';
import { SearchBarProps } from './props';
import _ from 'lodash';
import { SearchResult } from '../../../src/types';
import classNames from 'classnames';
import { useToggle } from 'react-use';
import QueryString from 'qs';

const SearchComponent: FC<SearchResult & { clickFunc: any }> = (props) => (
   <Link
      to={`/manga?id=${props.item.id}`}
      className="search-item"
      title={props.item.name}
      onClick={props.clickFunc}
   >
      <div
         className="cover-img"
         style={{
            backgroundImage: `url('${props.item.cover}')`,
         }}
      ></div>
      <div className="name">
         {_.chunk(props.item.name.split(' '), 8).map((e, i) => (
            <p key={i}>{e.join(' ')}</p>
         ))}
      </div>
   </Link>
);

const SearchBar: FC<SearchBarProps> = (props) => {
   const searchQuery = useSelector((state) => state.controls.search);
   const [isFocused, toggleFocus] = useToggle(false);
   const dispatch = useDispatch();
   const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      dispatch(setSearch(e.target.value));
   };
   const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
      dispatch(setSearch(''));
   };
   // useEffect(() => () => dispatch(setSearch()))
   const search = useSearchQuery(searchQuery.current);
   return (
      <>
         <div className="search-bar">
            <input
               type="text"
               name="search"
               placeholder="Search..."
               onChange={handleSearchChange}
               autoComplete="off"
               autoCorrect="off"
               onFocus={() => toggleFocus(true)}
               onBlur={() => toggleFocus(false)}
               defaultValue={searchQuery.current || searchQuery.prev || ''}
            />
            {!!searchQuery.current && (
               <div className="search-list">
                  {!!searchQuery.current && search.isFetching && (
                     <div className="search-loading loading-animation">
                        Loading results...
                     </div>
                  )}
                  {search.isSuccess &&
                     search.data.length === 0 &&
                     isFocused &&
                     !search.isFetching &&
                     !!searchQuery.current && (
                        <div className="search-loading">
                           Nothing Found! {':('}
                        </div>
                     )}
                  {search.isSuccess &&
                     search.data.map((manga) => (
                        <SearchComponent
                           key={manga.item.id}
                           clickFunc={handleClick}
                           {...manga}
                        />
                     ))}
               </div>
            )}
         </div>
      </>
   );
};

const Main = () => {
   const { page, limit } = useSelector((state) => state.controls);
   const location = useLocation();
   const pageQuery = QueryString.parse(location.search.slice(1)).page;
   const isBlur = useSelector((state) => state.controls.blur);
   const [getMangas, mangas] = useLazyAllMangasQuery();
   const dispatch = useDispatch();

   useEffect(() => {
      getMangas({
         page: pageQuery ? Number(pageQuery) : page.current,
         limit,
      });
   }, [pageQuery]);

   useEffect(() => {
      dispatch(
         setPage({
            current: pageQuery ? Number(pageQuery) : page.current,
            next:
               typeof mangas.data?.next === 'number'
                  ? mangas.data?.next
                  : page.next,
            prev:
               typeof mangas.data?.prev === 'number'
                  ? mangas.data?.prev
                  : page.prev,
            last:
               typeof mangas.data?.last === 'number'
                  ? mangas.data?.last
                  : page.last,
            first:
               typeof mangas.data?.first === 'number'
                  ? mangas.data?.first
                  : page.first,
            total:
               typeof mangas.data?.total === 'number'
                  ? mangas.data?.total
                  : page.total,
         })
      );
   }, [mangas.data, pageQuery]);

   return (
      <div id="main">
         <div className={styles.header_flex}>
            <h1 className="logo">
               <Link to="/">
                  <div>Reader</div>
               </Link>
            </h1>
            <div className="btn-flex">
               <button
                  onClick={() =>
                     getMangas({
                        refresh: true,
                        page: pageQuery ? Number(pageQuery) : page.current,
                        limit,
                     })
                  }
                  className={styles.refresh_btn}
               >
                  <MdRefresh fontSize="1.2rem" />
                  <div>Refresh</div>
               </button>
               <button
                  onClick={() =>
                     getMangas({
                        _updateCovers: true,
                        page: pageQuery ? Number(pageQuery) : page.current,
                        limit,
                     })
                  }
                  className={styles.refresh_btn}
               >
                  <MdRefresh fontSize="1.2rem" />
                  <div>Covers</div>
               </button>
               <button
                  onClick={() => dispatch(toggleBlur())}
                  className={classNames('is-blur-check', styles.refresh_btn)}
               >
                  <input
                     type="checkbox"
                     checked={isBlur}
                     onChange={() => dispatch(toggleBlur())}
                  />
                  <div>Blur</div>
               </button>
            </div>
         </div>
         <SearchBar />
         <ErrorBlock
            retry={() => getMangas()}
            hasErrors={mangas.isError}
            errors={mangas.error}
            isFetching={mangas.isFetching}
         >
            <Reader
               total={mangas?.data?.items.length}
               data={mangas?.data?.items}
               loading={mangas.isFetching}
               refetch={getMangas}
            />
         </ErrorBlock>
      </div>
   );
};
export default Main;
