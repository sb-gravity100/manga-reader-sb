import _ from 'lodash';
import { SearchResult } from 'nhentai';
import { FC } from 'react';
import { Pagination } from 'react-bootstrap';
import { MdRefresh, MdBlurOn, MdBlurOff } from 'react-icons/md';

interface PPage {
   page?: any;
   next: any;
   current: any;
   refresh?: any;
   blur?: any[];
}

const PaginationComponent: FC<PPage> = ({
   page,
   next,
   refresh,
   blur,
   current,
}) => {
   var renderPages = () => {
      var pages: JSX.Element[] = [];
      var start = current;
      var end = current + 5;
      start -= 4;
      if (end > page?.numPages) {
         end = page?.numPages;
         start -= 5 - (page?.numPages - current);
      }
      if (start < 0) {
         start = 0;
         end += 5 - current - 1;
      }
      for (let n = start; n < end; n++) {
         pages.push(
            <Pagination.Item
               onClick={() =>
                  next(
                     new URLSearchParams({
                        page: (n + 1) as any,
                     })
                  )
               }
               key={n + 1}
               active={current === n + 1}
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
         {blur && (
            <Pagination.Item
               onClick={() => {
                  if (blur) {
                     blur[1]();
                  }
               }}
               className="me-3"
            >
               {blur.slice()[0] ? <MdBlurOn /> : <MdBlurOff />}
            </Pagination.Item>
         )}
         <Pagination.First
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: '1',
                  })
               )
            }
            disabled={1 === current}
         />
         <Pagination.Prev
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: (current - 1) as any,
                  })
               )
            }
            disabled={1 === current}
         />
         {page && renderPages()}
         <Pagination.Next
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: (current + 1) as any,
                  })
               )
            }
            disabled={page?.numPages === current}
         />
         <Pagination.Last
            onClick={() =>
               next(
                  new URLSearchParams({
                     page: page?.numPages as any,
                  })
               )
            }
            disabled={page?.numPages === current}
         />
      </Pagination>
   );
};

export default PaginationComponent;
