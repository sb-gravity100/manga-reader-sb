/* eslint-disable no-script-url */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import ReaderItem from './sub-components/ReaderItem';
import { useSpring, animated as anim } from 'react-spring';
import classname from 'classnames';
import {
   FaAngleLeft,
   FaAngleRight,
   FaAngleDoubleLeft,
   FaAngleDoubleRight,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { FC } from 'react';
import styles from '../css_modules/main.module.scss';
import { useSearchParam } from 'react-use';
import { ReaderProps } from './props';

const Reader: FC<ReaderProps> = props => {
   const p_index = useSearchParam('p_index');
   const chunks = _.chunk(props.data, 10);
   const loading_props = {
      text: useSpring({
         from: {
            opacity: 1,
         },
         opacity: 0,
         loop: { reverse: true },
         reset: true,
      }),
   };

   const isCurrent = (i: number) => {
      if (typeof p_index === 'string') {
         if (Number(p_index) < chunks.length && i === Number(p_index)) {
            return true;
         }
         if (p_index.match(/last/i) && i === chunks.length - 1) {
            return true;
         }
         if (p_index.match(/first/i) && i === 0) {
            return true;
         }
      } else {
         if (i === 0) {
            return true;
         }
      }
      return false;
   };
   return (
      <div className="main-reader">
         <div className="nav">
            {p_index && Number(p_index) !== 0 ? (
               <>
                  <Link to={`/?p_index=0`}>
                     <button disabled={isCurrent(0)} className="prev">
                        <FaAngleDoubleLeft />
                     </button>
                  </Link>
                  <Link to={`/?p_index=${Number(p_index) - 1}`}>
                     <button disabled={isCurrent(0)} className="prev">
                        <FaAngleLeft />
                     </button>
                  </Link>
               </>
            ) : (
               <>
                  <button disabled={isCurrent(0)} className="prev">
                     <FaAngleDoubleLeft />
                  </button>
                  <button disabled={true} className="prev">
                     <FaAngleLeft />
                  </button>
               </>
            )}
            {Number(p_index || 0) !== chunks.length - 1 ? (
               <>
                  <Link to={`/?p_index=${Number(p_index || 0) + 1}`}>
                     <button
                        disabled={
                           p_index
                              ? Number(p_index) === chunks.length - 1
                              : undefined
                        }
                        className="next">
                        <FaAngleRight />
                     </button>
                  </Link>
                  <Link to={`/?p_index=${chunks.length - 1}`}>
                     <button
                        disabled={
                           p_index
                              ? Number(p_index) === chunks.length - 1
                              : undefined
                        }
                        className="next">
                        <FaAngleDoubleRight />
                     </button>
                  </Link>
               </>
            ) : (
               <>
                  <button
                     disabled={
                        p_index
                           ? Number(p_index) === chunks.length - 1
                           : undefined
                     }
                     className="next">
                     <FaAngleRight />
                  </button>
                  <button
                     disabled={
                        p_index
                           ? Number(p_index) === chunks.length - 1
                           : undefined
                     }
                     className="next">
                     <FaAngleDoubleRight />
                  </button>
               </>
            )}
         </div>
         <div className="main-reader-box">
            {!props.loading && props.data ? (
               <div className={classname('main-reader-flex', 'current')}>
                  {chunks[p_index ? Number(p_index) : 0].map(item => (
                     <ReaderItem key={item.id} item={item} />
                  ))}
               </div>
            ) : (
               <div className={styles.loading_style}>
                  <h3>
                     <anim.span style={loading_props.text}>
                        Loading...
                     </anim.span>
                  </h3>
               </div>
            )}
         </div>
      </div>
   );
};

export default Reader;
