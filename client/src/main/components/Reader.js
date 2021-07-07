import PropTypes from 'prop-types'
import MangaTable from './sub-components/TableComponent'

const Reader = props => {
  return <MangaTable data={props.data} />
}

Reader.propTypes = {
  data: PropTypes.array,
  filterValue: PropTypes.string,
}

export default Reader
