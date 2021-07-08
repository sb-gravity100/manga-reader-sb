/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
import styles from '../css_modules/main.module.scss';
import classname from 'classnames';

const Reader = props => {
   return (
      <div className="main-reader">
         <div className="main-reader-flex">
            {props.data.map(item => (
               <div className="flex-item">
                  <div
                     className="bg-img"
                     style={{ backgroundImage: `url('${item.cover}')` }}>
                     <div className="background" ></div></div>
                  <div className={classname('description', styles.marquee)}>
                     <p className={styles.marquee_child}>{item.name}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

Reader.propTypes = {
   data: PropTypes.array,
   filterValue: PropTypes.string,
};

export default Reader;
