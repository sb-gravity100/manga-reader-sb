import {
   Button,
   Container,
   Form,
   FormControl,
   InputGroup,
} from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useSearchQuery } from '../../slices/HentaiApi';
import { LoadingMangas } from '../sub-components/Loading';
import PaginationComponent from '../sub-components/Navigation';
import { SortMethods } from 'nhentai/lib/constants';
import _ from 'lodash';
import { getSearchParams } from '../props';
import { useMemo, useRef } from 'react';
import { useToggle } from 'react-use';
import DoujinCard from '../sub-components/DoujinCard';

const SearchPage: React.FC = (props) => {
   const blur = useToggle(true);
   const searchRef = useRef<HTMLInputElement>();
   const Sorts = useMemo(() => _.toPairs(SortMethods), []);
   const [params, next] = useSearchParams(
      new URLSearchParams({
         page: '1',
         sort: '',
         q: '*',
      })
   );
   const doujins = useSearchQuery(getSearchParams(params));
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
         <Form
            onSubmit={(e) => {
               e.preventDefault();
               next({
                  ...getSearchParams(params),
                  q: searchRef.current?.value,
               });
            }}
         >
            <FormControl
               type="search"
               placeholder="Search"
               aria-label="Search"
               autoComplete="none"
               // name="q"
               ref={searchRef as any}
            />
            {/* <InputGroup className="mt-2">
               <InputGroup.Text>Tag</InputGroup.Text>
               <FormControl
                  type="text"
                  placeholder="Search by tag here..."
                  name="tag"
                  aria-label="Tag"
                  autoComplete="none"
               />
            </InputGroup> */}
         </Form>
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
                     <h1>Search something...</h1>
                     <Button
                        className="w-100"
                        onClick={() => {
                           searchRef.current?.focus();
                        }}
                     >
                        Search
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

export default SearchPage;
