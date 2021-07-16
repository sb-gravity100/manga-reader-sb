import Image from 'react-cool-img'
import errorImg from '../img/404.jpg'

const MangaView = ({ panelImg }) => (
  <div className="panel">
    <Image
      src={`/${panelImg.path}`}
      alt={panelImg.name}
      error={errorImg}
      style={!panelImg ? { background: '#444', height: '500px' } : {}}
    />
  </div>
  )

export default MangaView
