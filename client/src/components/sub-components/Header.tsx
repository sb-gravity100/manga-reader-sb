import classNames from 'classnames';
import React, { useState } from 'react';
import {
   Button,
   Container,
   Form,
   FormControl,
   InputGroup,
   Navbar,
   ListGroup,
   Card,
   Image,
   Spinner,
   Nav,
} from 'react-bootstrap';
import path from 'path';
import { Link } from 'react-router-dom';
import { Manga } from '../../../../src/types';
import { useSearchQuery } from '../../slices/MangaApi';

interface PSearch {
   item: Manga;
}

const SearchResult: React.FC<PSearch> = (props) => {
   var thumbnail = `/gallery/${props.item.id}/${path.basename(
      props.item.thumbnail.url
   )}`;
   return (
      <ListGroup.Item
         style={{ height: '90px' }}
         className="d-flex bg-secondary position-relative"
      >
         <Image
            className="flex-shrink-0 me-2 rounded"
            src={thumbnail}
            width="60"
         />
         <Link
            className="d-inline-block text-truncate stretched-link"
            to={`/manga/${props.item.id}`}
         >
            {props.item.titles.pretty}
         </Link>
      </ListGroup.Item>
   );
};

const Header: React.FC = () => {
   const [value, setSearch] = useState('');
   const search = useSearchQuery(value);
   // console.log(search);

   return (
      <Navbar expand="lg">
         <Container>
            <Link to="/">
               <Navbar.Brand>
                  <img
                     alt=""
                     src="/favicon.png"
                     height="60"
                     className="d-inline-block align-top"
                  />
               </Navbar.Brand>
            </Link>
            <Navbar.Toggle className="bg-light" aria-controls="nav" />
            <Navbar.Collapse id="nav" className="justify-content-md-end py-2">
               <Link className="nav-link" to="/online">
                  Online Mode
               </Link>
               <Form className="position-relative">
                  <FormControl
                     type="search"
                     placeholder="Search"
                     className="me-2"
                     aria-label="Search"
                     autoComplete="none"
                     value={value}
                     onChange={(e) => setSearch(e.target.value)}
                  />
                  <Card
                     className="position-absolute top-100 end-0 rounded mt-2"
                     style={{
                        width: '450px',
                        maxHeight: '400px',
                        zIndex: 9999,
                        display: !value ? 'none' : undefined,
                     }}
                  >
                     <ListGroup className="overflow-auto" variant="flush">
                        {search.isFetching && (
                           <ListGroup.Item className="d-flex align-items-center justify-content-center bg-secondary position-relative">
                              <Spinner animation="border" role="status">
                                 <span className="visually-hidden">
                                    Loading...
                                 </span>
                              </Spinner>
                           </ListGroup.Item>
                        )}
                        {!search.isFetching && search?.data?.length === 0 && (
                           <ListGroup.Item className="d-flex align-items-center justify-content-center bg-secondary position-relative">
                              Nothing Found :(
                           </ListGroup.Item>
                        )}
                        {search.isSuccess &&
                           search.data?.map((e, i) => (
                              <SearchResult key={e.id} item={e} />
                           ))}
                     </ListGroup>
                  </Card>
               </Form>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default Header;
