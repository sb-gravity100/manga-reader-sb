import _ from 'lodash';
import { FC } from 'react';
import { Card, Container, Placeholder, Spinner } from 'react-bootstrap';

export const LoadingMangas: FC<any> = (props) => (
   <>
      {_.times(props.num || 10, (n) => (
         <Card key={n} className="bg-light" style={{ width: '12rem' }}>
            <Card.Img variant="top" height="190" src="/loading.gif" />
            <Card.Body className="py-1 px-2">
               <Placeholder as={Card.Title} animation="wave">
                  <Placeholder className="mx-auto" bg="info" xs={12} />
               </Placeholder>
            </Card.Body>
         </Card>
      ))}
   </>
);

export const LoadingScreen: FC = () => (
   <div
      style={
         { height: '100vh', '--bs-bg-opacity': '.5', width: '100vh' } as any
      }
      className="d-flex position-fixed top-0 start-0 w-100 align-items-center justify-content-center"
   >
      <Spinner variant="primary" animation="border" role="status">
         <span className="visually-hidden">Loading...</span>
      </Spinner>
   </div>
);
