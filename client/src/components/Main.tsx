import { Link } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import { FC } from 'react';
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
import {
   clearSearch,
   setPage,
   setSearch,
   toggleBlur,
} from '../slices/ControlSlice';
import { SearchBarProps } from './props';
import _ from 'lodash';
import { SearchResult } from '../../../src/types';
import classNames from 'classnames';
import { useSearchParam } from 'react-use';

const SearchComponent: FC<SearchResult> = (props) => (
   <Link
      to={`/manga?id=${props.item.id}`}
      className="search-item"
      title={props.item.name}
   >
      <div
         className="cover-img"
         style={{
            backgroundImage: `url('${props.item.cover}')`,
         }}
      ></div>
      <div>
         {_.chunk(props.item.name.split(' '), 8).map((e, i) => (
            <div key={i}>{e.join(' ')}</div>
         ))}
         ...
      </div>
   </Link>
);

const SearchBar: FC<SearchBarProps> = (props) => {
   const searchQuery = useSelector((state) => state.controls.search);
   const dispatch = useDispatch();
   const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!e.target.value) {
         dispatch(clearSearch());
      } else {
         dispatch(setSearch(e.target.value));
      }
   };
   const search = useSearchQuery(searchQuery);
   return (
      <div className="search-bar">
         <input
            type="text"
            name="search"
            placeholder="Search..."
            onChange={handleSearchChange}
            autoComplete="off"
         />
         {search.isSuccess && search.data.length > 0 && (
            <div className="search-list">
               {search.data.map((manga) => (
                  <SearchComponent {...manga} />
               ))}
            </div>
         )}
      </div>
   );
};

const Main = () => {
   const { page, limit } = useSelector((state) => state.controls);
   const pageQuery = useSearchParam('page');
   const isBlur = useSelector((state) => state.controls.blur);
   const [getMangas, mangas] = useLazyAllMangasQuery();
   const dispatch = useDispatch();

   useEffect(() => {
      getMangas({
         page: pageQuery ? Number(pageQuery) : page.current,
         limit,
      });
   }, [pageQuery]);

   if (mangas.isSuccess) {
      console.log(mangas.data);
   }

   useEffect(() => {
      dispatch(
         setPage({
            current: pageQuery ? Number(pageQuery) : 0,
            next: mangas.data?.next?.page,
            prev: mangas.data?.prev?.page,
            last: mangas.data?.last?.page,
            first: mangas.data?.first?.page,
            total: mangas.data?.total,
         })
      );
   }, [mangas]);

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
