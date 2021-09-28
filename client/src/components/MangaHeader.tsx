import { FC } from 'react';
import { FaPlus, FaMinus, FaSun, FaLightbulb } from 'react-icons/fa';
import { setZoom, toggleBrightness } from '../slices/ControlSlice';
import { useDispatch, useSelector } from '../store';
import { MangaHeaderProps } from './props';
import gsap from 'gsap';
import _times from 'lodash/times';
// import styles from '../css_modules/Manga.module.scss';

const snapNum = gsap.utils.snap({ values: _times(10, (n) => n++), radius: 1 });

const MangaHeader: FC<MangaHeaderProps> = ({ manga }) => {
   const dispatch = useDispatch();
   const { zoom, brightness } = useSelector((state) => state.controls);
   return (
      <header>
         <h2 className="logo">{manga?.name || '...'}</h2>
         <nav>
            <div className="bright-control">
               <button onClick={() => dispatch(toggleBrightness())}>
                  <FaLightbulb
                     opacity={brightness ? 1 : 0.4}
                     fontSize="1.1rem"
                  />
               </button>
            </div>
            <div className="zoom-control">
               <button
                  type="button"
                  onClick={() => dispatch(setZoom(snapNum(zoom - 1)))}
               >
                  <FaMinus />
               </button>
               <button
                  type="button"
                  onClick={() => dispatch(setZoom(snapNum(zoom + 1)))}
               >
                  <FaPlus />
               </button>
            </div>
         </nav>
      </header>
   );
};

export default MangaHeader;
