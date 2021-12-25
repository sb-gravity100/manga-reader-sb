import React, { useMemo, useState } from 'react';
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
   Dropdown,
   SplitButton,
   Badge,
} from 'react-bootstrap';
import path from 'path';
import { Link } from 'react-router-dom';
import { Manga } from '../../../../src/types';
import { useSearchQuery } from '../../slices/MangaApi';
import _ from 'lodash';
import { useToggle } from 'react-use';

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
         className="d-flex bg-secondary bg-opacity-50 position-relative"
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
            <div>{props.item.titles.pretty}</div>
            <div className="d-flex flex-wrap">
               {_.take(
                  props.item.tags.all.filter((e) => e.type === 'tag'),
                  5
               ).map((e) => (
                  <Badge>{e.name}</Badge>
               ))}
               {props.item.tags.all.length > 5 && (
                  <Badge>...{props.item.tags.all.length - 5} more</Badge>
               )}
            </div>
         </Link>
      </ListGroup.Item>
   );
};

const Header: React.FC = () => {
   const [value, setSearch] = useState('');
   const [thumb, setThumb] = useToggle(false);
   const [all, setAll] = useToggle(false);
   const [searchBy, setSearchBy] = useState('title');
   const searchVals = useMemo(
      () => ['artist', 'tag', 'language', 'category', 'parody', 'title'],
      []
   );
   const search = useSearchQuery({
      q: value,
      by: searchBy as any,
   });
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
               <Nav.Link
                  onClick={() => {
                     if (!thumb) {
                        setThumb(true);
                        window
                           .fetch('/api/refresh?type=thumb')
                           .then(() => setThumb(false))
                           .catch(() => setThumb(false));
                     }
                  }}
                  className="nav-link"
                  style={
                     {
                        pointerEvents: thumb && 'none',
                     } as any
                  }
               >
                  Reload Covers
               </Nav.Link>
               <Nav.Link
                  onClick={() => {
                     if (!all) {
                        setAll(true);
                        window
                           .fetch('/api/refresh?type=all')
                           .then(() => setAll(false))
                           .catch(() => setAll(false));
                     }
                  }}
                  className="nav-link"
                  style={
                     {
                        pointerEvents: all && 'none',
                     } as any
                  }
               >
                  Reload Mangas
               </Nav.Link>
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
                     <SplitButton
                        variant="outline-secondary"
                        title={searchBy}
                        id="segmented-button-dropdown-2"
                        align="end"
                        style={{
                           zIndex: 9999,
                        }}
                     >
                        {searchVals
                           .filter((e) => e !== searchBy)
                           .map((e, i) => (
                              <Dropdown.Item
                                 key={i}
                                 onClick={() => setSearchBy(e)}
                                 href="#"
                              >
                                 {e}
                              </Dropdown.Item>
                           ))}
                     </SplitButton>
                  </InputGroup>
                  <Card
                     className="position-absolute top-100 end-0 rounded mt-2 bg-opacity-0"
                     style={{
                        width: '450px',
                        maxHeight: '400px',
                        zIndex: 9000,
                        display: !value ? 'none' : undefined,
                     }}
                  >
                     <ListGroup
                        className="overflow-auto bg-opacity-0"
                        variant="flush"
                     >
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
