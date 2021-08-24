import { Link } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import { FC } from 'react'
import Reader from './Reader';
import ErrorBlock from './sub-components/ErrorBlock';
import { useState, useEffect, ChangeEventHandler } from 'react';
import styles from '../style.module.scss';
import { useAllMangasQuery } from '../slices/MangaApi';

const SearchComponent: FC<Record<string, any>> = props => <Link
   to={`/manga?id=${props.item.id}`}
   className="search-props.item"
   title={props.item.name}>
   <div
      className="cover-img"
      style={{
         backgroundImage: `url('${props.item.cover}')`,
      }}></div>
   <div className="name">{props.item.name}</div>
</Link>

const Main = () => {
   const [searchList, setSearchList] = useState<{
      isSearched: boolean;
      data?: any[];
   }>({
      isSearched: false,
   });
   const { data = [], isFetching: loading } = useAllMangasQuery(null)

   const handleSearchChange: ChangeEventHandler<HTMLInputElement> = e => {
      if (!e.target.value) {
         return setSearchList({
            isSearched: false,
            data: undefined,
         });
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
                  className={styles.refresh_btn}>
                  <MdRefresh fontSize="1.2rem" />
                  <span>Refresh</span>
               </button>
               <button
                  // onClick={}
                  className={styles.refresh_btn}>
                  <MdRefresh fontSize="1.2rem" />
                  <span>Covers</span>
               </button>
            </div>
         </div>
         <div className="search-bar">
            <input
               type="text"
               name="search"
               placeholder="Search..."
               onChange={handleSearchChange}
               onBlur={() => setSearchList({ isSearched: false })}
               autoComplete="none"
               autoCorrect="none"
               aria-autocomplete="none"
            />
            {searchList.isSearched && (
               <div className="search-list">
               </div>
            )}
         </div>
         <ErrorBlock
            status={mangas.networkStatus}
            loading={mangas.loading}
            retry={mangas.refetch}
            hasErrors={Boolean(mangas.error)}
            errors={mangas.error}>
            <Reader
               total={mangas?.data?.total}
               data={mangas?.data?.list}
               loading={mangas.loading}
               refetch={mangas.refetch}
            />
         </ErrorBlock>
      </div>
   );
};
export default Main;
