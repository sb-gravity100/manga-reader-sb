import { Doujin } from 'nhentai';
import {
   Button,
   Card,
   Container,
   OverlayTrigger,
   Tooltip,
} from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetHomepageQuery } from '../../slices/HentaiApi';
import { LoadingMangas } from '../sub-components/Loading';
import PaginationComponent from '../sub-components/Navigation';
import { SortMethods } from 'nhentai/lib/constants';
import _ from 'lodash';
import { getSearchParams } from '../props';
import { useToggle } from 'react-use';
import DoujinCard from '../sub-components/DoujinCard';
import { useMemo } from 'react';

const Homepage: React.FC = (props) => {
   const blur = useToggle(true);
   const Sorts = useMemo(() => _.toPairs(SortMethods), []);
   const [params, next] = useSearchParams(
      new URLSearchParams({
         page: '1',
         sort: '',
      })
   );
   const doujins = useGetHomepageQuery(getSearchParams(params));
   var PageComp = () => (
      <PaginationComponent
         refresh={() => {
            doujins.refetch();
         }}
         next={(e: any) =>
            next(
               new URLSearchParams({
                  ...getSearchParams(params),
                  ...getSearchParams(e),
               })
            )
         }
         page={doujins?.data}
         blur={blur}
         current={Number(params.get('page') || 1)}
      />
   );

   return (
      <Container className="d-flex flex-column gap-3 py-2">
         <PageComp />
         <div className="d-flex justify-content-center gap-2">
            {Sorts.map((e) => (
               <Button
                  variant={
                     params.get('sort') === e[1] ? 'primary' : 'outline-primary'
                  }
                  key={e[0]}
                  onClick={() =>
                     next(
                        new URLSearchParams({
                           ...getSearchParams(params),
                           sort: e[1],
                        })
                     )
                  }
               >
                  {e[0]}
               </Button>
            ))}
         </div>
         <div className="d-flex flex-wrap gap-4 justify-content-center">
            {doujins.isSuccess && !doujins.isFetching ? (
               doujins.data?.doujins.map((n) => {
                  return (
                     <DoujinCard
                        refetch={doujins.refetch}
                        key={n.id}
                        doujin={n}
                        blur={blur}
                     />
                  );
               })
            ) : doujins.isError ? (
               <>
                  <div className="h-100 d-flex align-items-center justify-content-center flex-column mx-auto my-5">
                     <h1>something went wrong...</h1>
                     <Button
                        className="w-100"
                        onClick={() => {
                           doujins.refetch();
                        }}
                     >
                        Retry?
                     </Button>
                  </div>
               </>
            ) : (
               <LoadingMangas num={10} />
            )}
         </div>
         <PageComp />
      </Container>
   );
};

export default Homepage;
