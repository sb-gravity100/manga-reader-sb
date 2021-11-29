import React from 'react';
import Reader from './Reader';
import Header from './sub-components/Header';

const Main: React.FC = () => {
   return (
      <div style={{ height: '100vh' }}>
         <Header />
         <Reader />
      </div>
   );
};

export default Main;
