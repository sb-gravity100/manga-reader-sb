/* eslint-disable no-restricted-globals */
import { FC, useEffect, useState } from 'react';
import {
   MdZoomIn,
   MdZoomOut,
   MdBrightnessHigh,
   MdBrightnessLow,
   MdStop,
   MdPlayCircleFilled,
} from 'react-icons/md';
import { useToggle, useLocalStorage, useRafLoop, useCounter } from 'react-use';
import { Button, Card } from 'react-bootstrap';

const MangaHeader: FC<any> = (props) => {
   var [isSlide, toggleSlide] = useToggle(false);
   var [isBright, toggleBright] = useToggle(true);
   var [zoomValue, zoom] = useCounter(600, 1100, 300);
   var [startLoop, stopLoop] = useRafLoop(() => {
      window.scrollBy(0, 1);
   }, isSlide);

   useEffect(() => {
      if (!isSlide) {
         startLoop();
      } else {
         // setFrames.reset();
         stopLoop();
      }
      return () => stopLoop();
   }, [isSlide]);
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
      <Card className="bg-secondary position-fixed me-3 end-0 top-0 mt-3">
         {/* <Card.Title>{frames}</Card.Title> */}
         <Card.Body className="p-2 d-flex flex-wrap gap-2">
            <Button
               onClick={() => zoom.inc(50)}
               variant="outline-primary"
               className="p-2"
            >
               <MdZoomIn />
            </Button>
            <Button
               onClick={() => zoom.dec(50)}
               variant="outline-primary"
               className="p-2"
            >
               <MdZoomOut />
            </Button>
            <Button
               onClick={() => toggleBright()}
               variant="outline-primary"
               className="p-2"
            >
               {isBright ? <MdBrightnessHigh /> : <MdBrightnessLow />}
            </Button>
            <Button
               onClick={() => toggleSlide()}
               variant="outline-primary"
               className="p-2"
            >
               {isSlide === false ? <MdPlayCircleFilled /> : <MdStop />}
            </Button>
         </Card.Body>
      </Card>
   );
};

export default MangaHeader;
