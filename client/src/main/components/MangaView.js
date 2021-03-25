import PropTypes from 'prop-types'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'

const MangaView = ({ panelImg }) => (
  <div className="panel">
    <LazyLoadImage
      placeholder={<span>Loading...</span>}
      effect="blur"
      src={`/api/${panelImg.path}`}
      alt={panelImg.name}
    />
  </div>
  )

MangaView.propTypes = {
  panelImg: PropTypes.exact({
    path: PropTypes.node,
    name: PropTypes.node,
  }),
}

export default MangaView
