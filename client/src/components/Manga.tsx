import { useEffect } from 'react';
import { useSearchParam } from 'react-use';
import MangaView from './MangaView';
import MangaHeader from './MangaHeader';
import ErrorBlock from './sub-components/ErrorBlock';
import { useGetMangaQuery } from '../slices/MangaApi';
import { useSelector } from '../store';
// import classNames from 'classnames';
import { StyleSheet, css } from 'aphrodite';
// import Loading from './sub-components/Loading';

const Manga = () => {
   return <div className="container"></div>;
};

export default Manga;
