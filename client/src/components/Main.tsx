import { Link } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import { FC } from 'react';
import Reader from './Reader';
import ErrorBlock from './sub-components/ErrorBlock';
import { useState, useEffect, ChangeEventHandler } from 'react';
import styles from '../style.module.scss';
import { useAllMangasQuery, useSearchQuery } from '../slices/MangaApi';
import { useDispatch, useSelector } from '../store';
import { clearSearch, setSearch } from '../slices/ControlSlice';
import { SearchBarProps } from './props';
import _ from 'lodash';
import { SearchResult } from '../../../src/types';

const SearchComponent: FC<SearchResult> = (props) => (
   <Link
      to={`/manga?id=${props.item.id}`}
      className="search-props.item"
      title={props.item.name}
   >
      <div
         className="cover-img"
         style={{
            backgroundImage: `url('${props.item.cover}')`,
         }}
      ></div>
      <div className="name">{props.item.name}</div>
   </Link>
);

const SearchBar: FC<SearchBarProps> = (props) => {
   const search = useSearchQuery(props.search);
   return (
      <div className="search-bar">
         <input
            type="text"
            name="search"
            placeholder="Search..."
            onChange={props.handleSearchChange}
            autoComplete="none"
            autoCorrect="none"
            aria-autocomplete="none"
         />
         {search.data?.length && (
            <div className="search-list">
               {_.sortBy(search.data).map((manga) => (
                  <SearchComponent {...manga} />
               ))}
            </div>
         )}
      </div>
   );
};

const Main = () => {
   const searchQuery = useSelector((state) => state.controls.search);
   const dispatch = useDispatch();
   const mangas = useAllMangasQuery(null);

   const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!e.target.value) {
         dispatch(clearSearch());
      } else {
         dispatch(setSearch(e.target.value));
      }
   };

   return (
      <div id="main">
         <div className={styles.header_flex}>
            <h1 className="logo">
               <Link to="/" style={{ color: 'white' }}>
                  <div>Reader</div>
               </Link>
            </h1>
            <div className="btn-flex">
               <button
                  // onClick={}
                  className={styles.refresh_btn}
               >
                  <MdRefresh fontSize="1.2rem" />
                  <span>Refresh</span>
               </button>
               <button
                  // onClick={}
                  className={styles.refresh_btn}
               >
                  <MdRefresh fontSize="1.2rem" />
                  <span>Covers</span>
               </button>
            </div>
         </div>
         <SearchBar
            handleSearchChange={handleSearchChange}
            search={searchQuery}
         />
         <ErrorBlock
            retry={mangas.refetch}
            hasErrors={mangas.isError}
            errors={mangas.error}
            isFetching={mangas.isFetching}
         >
            <Reader
               total={mangas?.data?.length}
               data={mangas?.data}
               loading={mangas.isFetching}
               refetch={mangas.refetch}
            />
         </ErrorBlock>
      </div>
   );
};
export default Main;
