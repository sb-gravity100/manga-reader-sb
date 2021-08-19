import { FC } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { MangaHeaderProps } from './props';
// import styles from '../css_modules/Manga.module.scss';

const MangaHeader: FC<MangaHeaderProps> = ({
   manga,
   zoomValue = 5,
   brightVal = 100,
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
               onChange={e => setBright(e.target.valueAsNumber)}
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
                  e.target.valueAsNumber <= 10 &&
                  e.target.valueAsNumber > 0 &&
                  setZoomVal(e.target.valueAsNumber)
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
