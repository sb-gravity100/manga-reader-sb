import { Button } from 'react-bootstrap';
import img from '../../img/temp2.png';

const NotFound = () => (
   <div
      className="position-fixed top-0 start-0 container-fluid"
      style={{
         height: '100vh',
         display: 'grid',
         placeItems: 'center',
         alignContent: 'center',
      }}
   >
      <h1 className="text-danger">404 Not Found</h1>
      <img src={img} alt="kono dio da" height={window.innerHeight / 2} />
      <Button
         variant="info"
         className="mt-2"
         onClick={() => window.history.back()}
      >
         Go Home Now
      </Button>
   </div>
);

export default NotFound;
