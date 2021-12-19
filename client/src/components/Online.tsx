import Header from './online/Header';
import Homepage from './online/Homepage';

const Online: React.FC = (props) => {
   return (
      <div
         style={{
            height: '100vh',
         }}
      >
         <Header />
         <Homepage />
      </div>
   );
};

export default Online;
