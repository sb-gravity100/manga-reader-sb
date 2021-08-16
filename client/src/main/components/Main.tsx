import { useQuery, useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import Reader from './Reader';
import ErrorBlock from './sub-components/ErrorBlock';
import { GET_MANGAS, SEARCH_MANGA, UPDATE_COVERS } from '../data/queries';
import { useState, useEffect } from 'react';
import styles from '../css_modules/main.module.scss';

const Main = () => {
  const mangas = useQuery(GET_MANGAS, {
    partialRefetch: true,
    notifyOnNetworkStatusChange: true,
  });
  const [searchList, setSearchList] = useState({
    isSearched: false,
    data: null,
  });
  const [REFRESH_COVERS] = useLazyQuery(UPDATE_COVERS)
  const [GET_SEARCH, search] = useLazyQuery(SEARCH_MANGA, {
    variables: {
      s: '',
    },
  });

  const handleSearchChange = e => {
    if (!e.target.value) {
      return setSearchList({
        isSearched: false,
        data: null,
      });
    }
    GET_SEARCH({
      variables: {
        s: e.target.value,
      },
    });
  };

  useEffect(() => {
    if (search.called && !search.loading && search.data && search.data.search) {
      setSearchList({
        isSearched: true,
        data: search.data.search,
      });
    }
  }, [search.called, search.loading, search.data]);

  return (
    <div id="main">
      <div className={styles.header_flex}>
        <h1 className="logo">
          <Link to="/" style={{ color: 'white' }}>
            <div>Reader</div>
          </Link>
        </h1>
        <div className="btn-flex" >
          <button
            onClick={() => mangas.refetch({ refresh: true })}
            className={styles.refresh_btn}>
            <MdRefresh fontSize="1.2rem" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => REFRESH_COVERS()}
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
          onBlur={() => setSearchList({ isSearched: false, data: null })}
        />
        {searchList.isSearched && (
          <div className="search-list">
            {searchList.data &&
              searchList.data.map(item => (
                <Link
                  to={`/manga?id=${item.id}`}
                  className="search-item"
                  title={item.name}>
                  <div
                    className="cover-img"
                    style={{
                      backgroundImage: `url('${item.cover}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minWidth: '3rem',
                      height: '4rem',
                      backgroundColor: '#444',
                    }}></div>
                  <div className="name">{item.name}</div>
                </Link>
              ))}
          </div>
        )}
      </div>
      <ErrorBlock
        status={mangas.networkStatus}
        loading={mangas.loading}
        retry={mangas.refetch}
        hasErrors={mangas.error && true}
        errors={mangas.error}>
        <Reader
          total={!mangas.loading && mangas.data && mangas.data.total}
          data={!mangas.loading && mangas.data && mangas.data.list}
          loading={mangas.loading}
          refetch={mangas.refetch}
        />
      </ErrorBlock>
    </div>
  );
};
export default Main;
