import { FaPlus, FaMinus } from 'react-icons/fa';
// import styles from '../css_modules/Manga.module.scss';

const MangaHeader = ({
   manga,
   zoomValue,
   brightVal,
   setBright,
   setZoomVal,
}) => (
   <header>
      <h2 className="logo">{manga ? manga.name : '...'}</h2>
      <nav>
         <div className="bright-control">
            <span>{brightVal}</span>
            <input
               type="range"
               min="0"
               max="100"
               onChange={e => setBright(e.target.value)}
               value={brightVal}
            />
         </div>
         <div className="zoom-control">
            <button
               type="button"
               onClick={() => setZoomVal(zoomValue > 1 ? zoomValue - 1 : 1)}>
               <FaMinus />
            </button>
            <input
               type="text"
               onChange={e =>
                  (e.target.value <= 10) & (e.target.value > 0) &&
                  setZoomVal(e.target.value)
               }
               value={zoomValue}
            />
            <button
               type="button"
               onClick={() => setZoomVal(zoomValue < 10 ? zoomValue + 1 : 10)}>
               <FaPlus />
            </button>
         </div>
      </nav>
   </header>
);

MangaHeader.defaultProps = {
   manga: {
      name: '',
      data: [],
   },
};

export default MangaHeader;
