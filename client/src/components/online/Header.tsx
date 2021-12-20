import { useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSearchQuery } from '../../slices/MangaApi';

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
               <Link className="nav-link" to="/">
                  Go Offline
               </Link>
               <Link className="nav-link" to="/online/search">
                  Search
               </Link>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

export default Header;
