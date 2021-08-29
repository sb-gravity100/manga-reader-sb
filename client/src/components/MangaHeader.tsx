import { FC } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { setBrightness, setZoom } from '../slices/ControlSlice';
import { useDispatch } from '../store';
import { MangaHeaderProps } from './props';
// import styles from '../css_modules/Manga.module.scss';

const MangaHeader: FC<MangaHeaderProps> = ({
   manga,
   zoomValue = 5,
   brightVal = 100,
}) => {
   const dispatch = useDispatch();
   return (
      <header>
         <h2 className="logo">{manga?.name || '...'}</h2>
         <nav>
            <div className="bright-control">
               <span>{brightVal}</span>
               <input
                  type="range"
                  min="0"
                  max="100"
                  onChange={(e) =>
                     dispatch(setBrightness(e.target.valueAsNumber))
                  }
                  value={brightVal}
               />
            </div>
            <div className="zoom-control">
               <button
                  type="button"
                  onClick={() =>
                     dispatch(setZoom(zoomValue > 1 ? zoomValue - 1 : 1))
                  }
               >
                  <FaMinus />
               </button>
               <input type="text" value={zoomValue} contentEditable="false" />
               <button
                  type="button"
                  onClick={() =>
                     dispatch(setZoom(zoomValue < 10 ? zoomValue + 1 : 10))
                  }
               >
                  <FaPlus />
               </button>
            </div>
         </nav>
      </header>
   );
};

export default MangaHeader;
