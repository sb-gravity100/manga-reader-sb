import _ from 'lodash';
import { FC } from 'react';
import { Pagination } from 'react-bootstrap';

interface PPage {
   page: any;
   next: any;
}

const PaginationComponent: FC<PPage> = ({ page, next }) => {
   return (
      <Pagination className="justify-content-center m-0">
         <Pagination.First
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page.first as any,
                  })
               )
            }
            disabled={page.first === page.current}
         />
         <Pagination.Prev
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page.prev as any,
                  })
               )
            }
            disabled={page.first === page.current}
         />
         {_.times(page.total, (n) => (
            <Pagination.Item
               onClick={() =>
                  next(
                     new URLSearchParams({
                        page: n as any,
                     })
                  )
               }
               key={n}
               active={page.current === n}
            >
               {n + 1}
            </Pagination.Item>
         ))}
         <Pagination.Next
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page.next as any,
                  })
               )
            }
            disabled={page.last === page.current}
         />
         <Pagination.Last
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page.last as any,
                  })
               )
            }
            disabled={page.last === page.current}
         />
      </Pagination>
   );
};

export default PaginationComponent;
