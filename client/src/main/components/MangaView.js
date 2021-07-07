import { LazyLoadImage } from 'react-lazy-load-image-component'

const MangaView = ({ panelImg }) => (
  <div className="panel">
    <LazyLoadImage
      src={`/${panelImg.path}`}
      alt={panelImg.name}
    />
  </div>
  )

export default MangaView
