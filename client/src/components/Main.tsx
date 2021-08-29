import { Link } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import { FC } from 'react';
import Reader from './Reader';
import ErrorBlock from './sub-components/ErrorBlock';
import { useState, useEffect, ChangeEventHandler } from 'react';
import styles from '../style.module.scss';
import { useLazyAllMangasQuery, useSearchQuery } from '../slices/MangaApi';
import { useDispatch, useSelector } from '../store';
import { clearSearch, setSearch, toggleBlur } from '../slices/ControlSlice';
import { SearchBarProps } from './props';
import _ from 'lodash';
import { SearchResult } from '../../../src/types';

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
      <div className="name">{props.item.name}</div>
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
   const [getMangas, mangas] = useLazyAllMangasQuery();
   const isBlur = useSelector((state) => state.controls.blur);
   const dispatch = useDispatch();
   useEffect(() => {
      getMangas(null);
   }, []);

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
                  onClick={() =>
                     getMangas({
                        refresh: true,
                     })
                  }
                  className={styles.refresh_btn}
               >
                  <MdRefresh fontSize="1.2rem" />
                  <span>Refresh</span>
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
                  <span>Covers</span>
               </button>
               <div className="is-blur-check">
                  <div>Blur</div>
                  <input
                     type="checkbox"
                     checked={isBlur}
                     onChange={() => dispatch(toggleBlur())}
                  />
               </div>
            </div>
         </div>
         <SearchBar />
         <ErrorBlock
            retry={() => getMangas(null)}
            hasErrors={mangas.isError}
            errors={mangas.error}
            isFetching={mangas.isFetching}
         >
            <Reader
               total={mangas?.data?.length}
               data={mangas?.data}
               loading={mangas.isFetching}
               refetch={() => getMangas(null)}
            />
         </ErrorBlock>
      </div>
   );
};
export default Main;
