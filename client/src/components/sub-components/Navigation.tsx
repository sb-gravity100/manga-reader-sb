import _ from 'lodash';
import { FC } from 'react';
import { Pagination } from 'react-bootstrap';
import { MdRefresh, MdBlurOn, MdBlurOff } from 'react-icons/md';

interface PPage {
   page: any;
   next: any;
   refresh?: any;
   blur?: any[];
}

const PaginationComponent: FC<PPage> = ({ page, next, refresh, blur }) => {
   var renderPages = () => {
      var pages: JSX.Element[] = [];
      var start = page.current;
      var end = page.current + 5;
      start -= 4;
      if (end > page.total) {
         end = page.total;
         start -= 5 - (page.total - page.current);
      }
      if (start < 0) {
         start = 0;
         end += 5 - page.current - 1;
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
         <Pagination.Item onClick={refresh} className="me-3">
            <MdRefresh />
         </Pagination.Item>
         <Pagination.Item
            onClick={() => {
               if (blur) {
                  blur[1]();
               }
            }}
            className="me-3"
         >
            {blur?.slice()[0] ? <MdBlurOn /> : <MdBlurOff />}
         </Pagination.Item>
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
