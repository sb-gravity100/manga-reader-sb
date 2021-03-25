import PropTypes from 'prop-types'
import { FaChevronCircleUp } from 'react-icons/fa'
import { useMemo, useEffect } from 'react'
import { useTable, useFilters, useSortBy } from 'react-table'
import { Link } from 'react-router-dom'
import { StyleSheet, css } from 'aphrodite'
import classNames from 'classnames'

const styles = StyleSheet.create({
  sortDown: {
    transform: 'rotate(-180deg)',
  },
  sortUp: {
    transform: 'rotate(0deg)',
  },
  sortNone: {
    transform: 'rotate(270deg)',
  },
  center: {
    display: 'inline-flex',
    alignItems: 'flex-end',
    marginLeft: '10px',
    justifyContent: 'center',
  },
  headers: {
    display: 'flex run-in',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const Reader = ({ data, filterValue }) => {
  const colData = useMemo(() => data, [])
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
    [],
  )

  const tableInstance = useTable({ columns, data }, useFilters, useSortBy)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = tableInstance

  useEffect(() => {
    setFilter('name', filterValue)
  }, [filterValue])

  return (
    <table className="list" {...getTableProps()}>
      <thead>
        {headerGroups.map(({ getHeaderGroupProps, headers }) => (
          <tr {...getHeaderGroupProps()}>
            {headers.map(column => (
              <th
                className={classNames(column.id, css(styles.headers))}
                {...column.getHeaderProps(
                  column.getSortByToggleProps({ title: undefined }),
                )}
              >
                <span>{column.render('Header')}</span>
                <FaChevronCircleUp
                  className={css(
                    column.isSorted
                      ? column.isSortedDesc
                        ? styles.sortDown
                        : styles.sortUp
                      : styles.sortNone,
                    styles.center,
                  )}
                />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr className="link" {...row.getRowProps()}>
              {row.cells.map(({
 getCellProps, render, column, value,
}) => (
  <td title={value} className={column.id} {...getCellProps()}>
    <Link to={`manga/${row.original.id}`}>{render('Cell')}</Link>
  </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

Reader.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array,
  filterValue: PropTypes.string,
}

export default Reader
