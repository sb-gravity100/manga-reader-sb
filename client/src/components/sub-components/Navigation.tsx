import _ from 'lodash';
import { FC } from 'react';
import { Pagination, PageItemProps } from 'react-bootstrap';

interface PPage {
   page: any;
   next: any;
}

const PaginationComponent: FC<PPage> = ({ page, next }) => {
   var renderPages = () => {
      var pages: JSX.Element[] = [];
      var start = page.current - 5;
      var end = page.current + 5;
      if (start < 0) start = 0;
      if (end > page.total) end = page.total;
      if (page.total < 10) {
         start = 0
         end = page.total;
      }
      for (let n = start; n < end; n++) {
         pages.push(
            <Pagination.Item
               onClick={() =>
                  next(
                     new URLSearchParams({
                        page: n as any,
                     })
                  )
               }
               key={n}
               active={page?.current === n}
            >
               {n + 1}
            </Pagination.Item>
         );
      }
      return pages;
   };
   return (
      <Pagination className="justify-content-center m-0">
         <Pagination.First
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page?.first as any,
                  })
               )
            }
            disabled={page?.first === page?.current}
         />
         <Pagination.Prev
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page?.prev as any,
                  })
               )
            }
            disabled={page?.first === page?.current}
         />
         {page && renderPages()}
         <Pagination.Next
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page?.next as any,
                  })
               )
            }
            disabled={page?.last === page?.current}
         />
         <Pagination.Last
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page?.last as any,
                  })
               )
            }
            disabled={page?.last === page?.current}
         />
      </Pagination>
   );
};

export default PaginationComponent;
