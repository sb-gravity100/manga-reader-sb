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

const Homepage: React.FC = (props) => {
   const Sorts = _.toPairs(SortMethods);
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
         // blur={blur}
         current={Number(params.get('page') || 1)}
      />
   );

   return (
      <Container className="d-flex flex-column gap-3 py-2">
         <PageComp />
         <div className="d-flex justify-content-center gap-2">
            {Sorts.map((e) => (
               <Button
                  variant="outline-primary"
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
         <div className="d-flex flex-wrap gap-2 justify-content-between">
            {doujins.isSuccess && !doujins.isFetching ? (
               doujins.data?.doujins.map((n) => {
                  return (
                     <Card
                        key={n.id}
                        className="bg-secondary"
                        style={{ width: '12rem' }}
                     >
                        <Card.Img
                           variant="top"
                           height="200"
                           src={`/api/fetch?url=${n.thumbnail.url}`}
                        />
                        <Card.Body className="pb-0 pt-1">
                           <OverlayTrigger
                              placement="auto"
                              overlay={<Tooltip>{n.titles.pretty}</Tooltip>}
                           >
                              <Link
                                 className="stretched-link"
                                 to={'../manga/' + n.id}
                              >
                                 <Card.Title
                                    style={{ fontSize: '13px' }}
                                    className="text-center text-truncate"
                                 >
                                    {n.titles.pretty}
                                 </Card.Title>
                              </Link>
                           </OverlayTrigger>
                        </Card.Body>
                     </Card>
                  );
               })
            ) : (
               <LoadingMangas num={20} />
            )}
         </div>
         <PageComp />
      </Container>
   );
};

export default Homepage;
