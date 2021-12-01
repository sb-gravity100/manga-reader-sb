/* eslint-disable no-restricted-globals */
import { FC, useEffect } from 'react';
import {
   MdZoomIn,
   MdZoomOut,
   MdBrightnessHigh,
   MdBrightnessLow,
   MdStop,
   MdPlayCircleFilled,
} from 'react-icons/md';
import { useToggle, useRafLoop, useCounter } from 'react-use';
import { Button, Card } from 'react-bootstrap';

const MangaHeader: FC<any> = (props) => {
   var [isSlide, toggleSlide] = useToggle(false);
   var [isBright, toggleBright] = useToggle(true);
   var [zoomValue, zoom] = useCounter(600, 900, 300);
   var [stopLoop, startLoop] = useRafLoop(() => {
      window.scrollBy(0, 1);
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
      <Card
         style={{ zIndex: 9999 }}
         className="bg-secondary position-fixed me-3 end-0 top-0 mt-3 text-center"
      >
         <Card.Header className="text-info">
            {props.manga?.name || '...'}
         </Card.Header>
         <Card.Body className="p-2 d-flex flex-wrap gap-2">
            <Button
               onClick={() => {
                  zoom.inc(50);
               }}
               variant="outline-primary"
               className="px-2 py-1"
            >
               <MdZoomIn alignmentBaseline="central" />
            </Button>
            <Button
               onClick={() => {
                  zoom.dec(50);
               }}
               variant="outline-primary"
               className="px-2 py-1"
            >
               <MdZoomOut alignmentBaseline="central" />
            </Button>
            <Button
               onClick={() => toggleBright()}
               variant="outline-primary"
               className="px-2 py-1"
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
               className="px-2 py-1"
            >
               {isSlide === false ? (
                  <MdPlayCircleFilled alignmentBaseline="central" />
               ) : (
                  <MdStop alignmentBaseline="central" />
               )}
            </Button>
         </Card.Body>
      </Card>
   );
};

export default MangaHeader;
