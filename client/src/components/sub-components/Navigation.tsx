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
   console.log(current);
   var renderPages = () => {
      var pages: JSX.Element[] = [];
      var start = current;
      var end = current + 10;
      if (end > page?.numPages) {
         end = page?.numPages + 1;
         // start -= page?.numPages - current;
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
               active={current === n}
               disabled={current === n}
            >
               {n}
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
               {!blur.slice()[0] ? <MdBlurOn /> : <MdBlurOff />}
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
