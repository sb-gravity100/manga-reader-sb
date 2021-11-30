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
import { setZoom, toggleBrightness } from '../slices/ControlSlice';
import { useDispatch, useSelector } from '../store';
import { MangaHeaderProps } from './props';
import _times from 'lodash/times';
import { useToggle } from 'react-use';

const MangaHeader: FC<MangaHeaderProps> = ({ manga }) => {
   return <></>;
};

export default MangaHeader;
