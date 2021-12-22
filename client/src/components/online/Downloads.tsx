import { useDispatch, useSelector } from '../../store';

const DownloadPage: React.FC = () => {
   const res = useSelector((state) => state.downloads.results);
   const dispatch = useDispatch();
   console.log(res);
   return <></>;
};

export default DownloadPage;
