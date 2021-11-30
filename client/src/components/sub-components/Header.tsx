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
   Image
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Manga } from '../../../../src/types';
import { useSearchQuery } from '../../slices/MangaApi';

interface PSearch {
   item: Manga;
}

const SearchResult: React.FC<PSearch> = (props) => {
   return <ListGroup.Item>
      <Link to={`/manga/${props.item.id}`}>
         <Image src={props.item.cover} thumbnail />
      </Link>
   </ListGroup.Item>;
};

const Header: React.FC = () => {
   const [value, setSearch] = useState('');
   const search = useSearchQuery(value);
   // console.log(search);

   return (
      <Navbar bg="dark" expand="lg">
         <Container>
            <Link to="/">
               <Navbar.Brand>
                  <img
                     alt=""
                     src="/kono_dio_da.png"
                     height="60"
                     className="d-inline-block align-top bg-light"
                  />
               </Navbar.Brand>
            </Link>
            <Navbar.Toggle className="bg-light" aria-controls="nav" />
            <Navbar.Collapse id="nav" className="justify-content-md-end py-2">
               <Form className="position-relative">
                  <InputGroup>
                     <FormControl
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        autoComplete="none"
                        value={value}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                     <Button variant="outline-light">Search</Button>
                     <Card
                        className="position-absolute top-100 end-0 rounded mt-2"
                        style={{
                           width: '450px',
                           height: '400px',
                           zIndex: 9999,
                        }}
                     >
                        <ListGroup
                           className="overflow-auto"
                           variant="flush"
                        ></ListGroup>
                     </Card>
                  </InputGroup>
               </Form>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default Header;
