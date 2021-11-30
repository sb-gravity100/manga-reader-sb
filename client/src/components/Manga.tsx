import { useEffect } from 'react';
import { useSearchParam } from 'react-use';
import ErrorBlock from './sub-components/ErrorBlock';
import { useGetMangaQuery } from '../slices/MangaApi';
import { useSelector } from '../store';
// import classNames from 'classnames';
import { StyleSheet, css } from 'aphrodite';
import { LoadingScreen } from './sub-components/Loading';

const Manga = () => {
   return (
      <div className="container">
         <LoadingScreen />
      </div>
   );
};

export default Manga;
