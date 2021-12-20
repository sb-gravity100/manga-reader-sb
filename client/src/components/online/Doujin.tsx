import { useParams } from 'react-router';
import { useGetMangaQuery } from '../../slices/MangaApi';

const DoujinPage: React.FC = (props) => {
   const { id } = useParams();
   const doujin = useGetMangaQuery(id as string);
   if (doujin.isSuccess) {
      console.log(doujin);
   }
   return <></>;
};

export default DoujinPage;
