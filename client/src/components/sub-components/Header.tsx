import React, { useCallback, useEffect, useRef } from 'react';
import {
   Button,
   Container,
   Form,
   FormControl,
   InputGroup,
   Nav,
   Navbar,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { setSearch } from '../../slices/ControlSlice';
import { useDispatch } from '../../store';

const Header: React.FC = () => {
   const searchRef = useRef<HTMLInputElement>();
   const dispatch = useDispatch();
   const changedSearch = useCallback(() => {
      console.log(searchRef.current?.value);
      dispatch(setSearch(searchRef.current?.value || ''));
   }, []);

   return (
      <Navbar bg="dark" expand="lg">
         <Container>
            <Link to="/">
               <Navbar.Brand>
                  <img
                     alt=""
                     src="/favicon.png"
                     width="30"
                     height="30"
                     className="d-inline-block align-top"
                  />{' '}
                  <Navbar.Text className="text-light">Za Warudo</Navbar.Text>
               </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-md-end">
               <Form className="d-flex">
                  <InputGroup>
                     <FormControl
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        ref={searchRef as any}
                        onChange={changedSearch}
                     />
                     <Button variant="outline-secondary">Search</Button>
                  </InputGroup>
               </Form>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default Header;
