import { useState } from 'react';
import { useSpring, animated as anim } from 'react-spring';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import Reader from './Reader';
import ErrorBlock from './sub-components/ErrorBlock';
import { GET_MANGAS } from '../data/queries';
import styles from '../css_modules/main.module.scss';

const Main = () => {
   const [filterValue, setFilterValue] = useState('');
   const mangas = useQuery(GET_MANGAS, {
      partialRefetch: true,
      notifyOnNetworkStatusChange: true,
   });
   const loading_props = {
      text: useSpring({
         from: {
            opacity: 1,
         },
         opacity: 0,
         loop: { reverse: true },
         reset: true
      }),
   };

   return (
      <div id="main">
         <div className={styles.header_flex}>
            <h1 className="logo">
               <Link to="/" style={{ color: 'white' }}>
                  <div>Reader</div>
               </Link>
            </h1>
            <div>
               <button
                  onClick={() => mangas.refetch()}
                  className={styles.refresh_btn}>
                  <MdRefresh fontSize="1.2rem" />
                  <span>Refresh</span>
               </button>
            </div>
         </div>
         <input
            onChange={e => setFilterValue(e.target.value)}
            className={styles.search_bar}
            type="search"
            placeholder="Filter"
            value={filterValue}
         />
         <ErrorBlock
            status={mangas.networkStatus}
            loading={mangas.loading}
            retry={mangas.refetch}
            hasErrors={mangas.error && true}
            errors={mangas.error}>
            {!mangas.loading ? (
               <Reader data={mangas.data.list} filterValue={filterValue} />
            ) : (
               <div className={styles.loading_style}>
                  <h3>
                     <anim.span style={loading_props.text}>
                        Loading...
                     </anim.span>
                  </h3>
               </div>
            )}
         </ErrorBlock>
      </div>
   );
};
export default Main;
