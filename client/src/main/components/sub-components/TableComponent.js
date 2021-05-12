import { FaAngleDown } from 'react-icons/fa';
import { useMemo, useEffect } from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';
import styles from '../../css_modules/reader.module.scss';

const TableComponents = props => {
   const columns = useMemo(
      () => [
         {
            Header: 'Name',
            accessor: 'name',
            sortDescFirst: true,
            Cell: ({ value }) => value.replace(/[\])}[{(_]/g, ''),
         },
         {
            Header: 'Size',
            accessor: 'size',
            sortDescFirst: true,
            Cell: ({ value }) => `${(value / 1000000).toFixed(2)}mb`,
         },
         {
            Header: 'Date',
            accessor: 'createdAt',
            Cell: ({ value }) => new Date(value).toDateString(),
            sortDescFirst: true,
         },
      ],
      []
   );
   const data = useMemo(() => props.data, []);

   const tableInstance = useTable({ columns, data }, useFilters, useSortBy);
   const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      setFilter,
   } = tableInstance;

   const mapHeaders = hGs =>
      hGs.map(headerGroup => (
         <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
               <th
                  className={classNames(column.id, styles.flex_column)}
                  {...column.getHeaderProps(
                     column.getSortByToggleProps({
                        title: 'Sort by ' + column.Header,
                     })
                  )}>
                  <div className={styles.sort_logo}>
                     <h4 className={column.id}>{column.render('Header')}</h4>
                     <div>
                        <FaAngleDown
                           className={classNames(
                              column.isSorted
                                 ? column.isSortedDesc
                                    ? styles.sort_down
                                    : styles.sort_up
                                 : styles.sort_none
                           )}
                           fontSize="1.2rem"
                        />
                     </div>
                  </div>
               </th>
            ))}
         </tr>
      ));
   const mapRows = _rows =>
      _rows.map(row => {
         prepareRow(row);
         return (
            <tr {...row.getRowProps()}>
               {row.cells.map(cell => (
                  <td
                     title={
                        cell.column.id === 'createdAt'
                           ? new Date(cell.value).toDateString()
                           : cell.value
                     }
                     className={cell.column.id}
                     {...cell.getCellProps()}>
                     <Link to={`/manga?id=${cell.row.original.id}`}>
                        <span>{cell.render('Cell')}</span>
                     </Link>
                  </td>
               ))}
            </tr>
         );
      });

   useEffect(() => {
      setFilter('name', props.filterValue);
   }, [props.filterValue, setFilter]);

   return (
      <table className="list" {...getTableProps()}>
         <colgroup>
            <col className="col-name" />
            <col className="col-size" />
            <col className="col-createdAt" />
         </colgroup>
         <thead>{mapHeaders(headerGroups)}</thead>
         <tbody
            className={classNames(styles.transitionize)}
            {...getTableBodyProps()}>
            {mapRows(rows)}
         </tbody>
      </table>
   );
};

export default TableComponents;
