import _ from 'lodash';
import { FC } from 'react';
import { Card, Placeholder } from 'react-bootstrap';
import loadingGif from '../../img/loading.gif';

export const LoadingMangas: FC = () => (
   <>
      {_.times(10, (n) => (
         <Card key={n} className="bg-light" style={{ width: '12rem' }}>
            <Card.Img variant="top" src={loadingGif} />
            <Card.Body className="py-1 px-2">
               <Placeholder as={Card.Title} animation="wave">
                  <Placeholder className="mx-auto" bg="info" xs={12} />
               </Placeholder>
            </Card.Body>
         </Card>
      ))}
   </>
);
