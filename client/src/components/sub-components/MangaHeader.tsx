/* eslint-disable no-restricted-globals */
import { FC, useEffect } from 'react';
import {
   MdZoomIn,
   MdZoomOut,
   MdBrightnessHigh,
   MdBrightnessLow,
   MdStop,
   MdPlayCircleFilled,
   MdArrowLeft,
   MdArrowRight,
} from 'react-icons/md';
import { useToggle, useRafLoop, useCounter, useEvent } from 'react-use';
import { Button, Card } from 'react-bootstrap';

const MangaHeader: FC<any> = (props) => {
   var [isSlide, toggleSlide] = useToggle(false);
   var [showPanel, togglePanel] = useToggle(true);
   var [isBright, toggleBright] = useToggle(true);
   var [zoomValue, zoom] = useCounter(600, 900, 300);
   var [stopLoop, startLoop] = useRafLoop(() => {
      if (window.scrollY < document.body.scrollHeight) {
         window.scrollBy({
            left: 0,
            top:
               (document.body.scrollHeight / props.manga?.pages.length) * 0.004,
            behavior: 'smooth',
         });
      } else {
         toggleSlide(false);
      }
   }, isSlide);

   useEffect(() => {
      if (isSlide) {
         startLoop();
      } else {
         // setFrames.reset();
         stopLoop();
      }
      return () => stopLoop();
   }, [isSlide, startLoop, stopLoop]);
   useEffect(() => {
      if (isBright) {
         props.setBright('brightness(1)');
      } else {
         props.setBright('brightness(0.65)');
      }
   }, [isBright, props]);
   useEffect(() => {
      props.setZoom(`${zoomValue || 600}px`);
   }, [zoomValue, props]);
   return (
      <div
         style={{ zIndex: 9999, height: '6rem' }}
         className="d-flex gap-2 position-fixed me-3 end-0 top-0 mt-3 "
      >
         <Card
            style={{
               maxWidth: showPanel ? '0' : '21rem',
               overflowX: 'hidden',
               transition: '0.2s',
            }}
            className="bg-secondary text-center"
         >
            <Card.Header className="text-info text-truncate">
               {props.manga?.titles.english || '...'}
            </Card.Header>
            <Card.Body className="p-2 d-flex flex-wrap gap-2">
               <Button
                  onClick={() => {
                     zoom.inc(50);
                  }}
                  variant="outline-primary"
                  className="px-2 py-1 align-middle"
               >
                  <MdZoomIn alignmentBaseline="central" />
               </Button>
               <Button
                  onClick={() => {
                     zoom.dec(50);
                  }}
                  variant="outline-primary"
                  className="px-2 py-1 align-middle"
               >
                  <MdZoomOut alignmentBaseline="central" />
               </Button>
               <Button
                  onClick={() => toggleBright()}
                  variant="outline-primary"
                  className="px-2 py-1 align-middle"
               >
                  {isBright ? (
                     <MdBrightnessHigh alignmentBaseline="central" />
                  ) : (
                     <MdBrightnessLow alignmentBaseline="central" />
                  )}
               </Button>
               <Button
                  onClick={() => toggleSlide()}
                  variant="outline-primary"
                  className="px-2 py-1 align-middle"
               >
                  {isSlide === false ? (
                     <MdPlayCircleFilled alignmentBaseline="central" />
                  ) : (
                     <MdStop alignmentBaseline="central" />
                  )}
               </Button>
            </Card.Body>
         </Card>
         <Button onClick={togglePanel} className="p-0">
            {showPanel ? (
               <MdArrowRight fontSize="2rem" />
            ) : (
               <MdArrowLeft fontSize="2rem" />
            )}
         </Button>
      </div>
   );
};

export default MangaHeader;
