/* eslint-disable no-restricted-globals */
import { FC, useState } from 'react';
import {
   MdZoomIn,
   MdZoomOut,
   MdBrightnessHigh,
   MdBrightnessLow,
   MdVolumeUp,
   MdStop,
   MdPlayCircleFilled,
} from 'react-icons/md';
import { FaAngleDoubleRight, FaAngleRight } from 'react-icons/fa';
import {
   toggleScroll,
   setZoom,
   toggleBrightness,
} from '../slices/ControlSlice';
import { useDispatch, useSelector } from '../store';
import { MangaHeaderProps } from './props';
import gsap from 'gsap';
import _times from 'lodash/times';

const snapNum = gsap.utils.snap({ values: _times(10, (n) => n++), radius: 1 });

const MangaHeader: FC<MangaHeaderProps> = ({ manga }) => {
   const [scrollID, setScrollID] = useState<any>();
   const dispatch = useDispatch();
   const { zoom, brightness, scrollDown } = useSelector(
      (state) => state.controls
   );
   const scrollIt = (speed: number) =>
      setInterval(
         () => scrollBy({ top: speed, left: 0, behavior: 'smooth' }),
         80
      );

   const handleScrollClick = () => {
      dispatch(toggleScroll());
      console.log(scrollDown);
      if (scrollDown) {
         setScrollID(scrollIt(5));
      } else {
         clearInterval(scrollID);
         setScrollID(undefined);
      }
   };
   return (
      <header>
         <h2 className="logo">{manga?.name || '...'}</h2>
         <nav>
            <div className="speed-control" onClick={handleScrollClick}>
               <button>
                  {!scrollDown ? <MdStop /> : <MdPlayCircleFilled />}
               </button>
            </div>
            <div className="bright-control">
               <button onClick={() => dispatch(toggleBrightness())}>
                  {brightness ? (
                     <MdBrightnessHigh fontSize="1.1rem" />
                  ) : (
                     <MdBrightnessLow fontSize="1.1rem" />
                  )}
               </button>
            </div>
            <div className="zoom-control">
               <button
                  type="button"
                  onClick={() => dispatch(setZoom(snapNum(zoom - 1)))}
               >
                  <MdZoomOut fontSize="1.2rem" />
               </button>
               <button
                  type="button"
                  onClick={() => dispatch(setZoom(snapNum(zoom + 1)))}
               >
                  <MdZoomIn fontSize="1.2rem" />
               </button>
            </div>
         </nav>
      </header>
   );
};

export default MangaHeader;
