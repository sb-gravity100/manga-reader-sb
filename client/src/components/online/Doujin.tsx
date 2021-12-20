import { Col, Container, Image, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Manga } from '../../../../src/types';
import { useGetDoujinQuery } from '../../slices/HentaiApi';

const DoujinData: React.FC<{ doujin: Manga }> = (props) => {
   return <></>;
};

const DoujinPage: React.FC = (props) => {
   const { id } = useParams();
   const doujin = useGetDoujinQuery(id as string);
   if (doujin.isSuccess) {
      console.log(doujin);
   }
   const showTitle = () => {
      var splitted = doujin.data?.titles.english.split(
         doujin.data?.titles.pretty
      ) as string[];
      return (
         <>
            {splitted[0]}
            <span className="fw-bold">{doujin.data?.titles.pretty}</span>{' '}
            {splitted[1]}
         </>
      );
   };
   return (
      <Container className="w-75">
         {doujin.isSuccess && (
            <Row xs={5} className="text-light">
               <Col xs={2}>
                  <Image
                     rounded
                     style={{ width: '100%', filter: 'blur(7px)' }}
                     src={`/api/fetch?url=${doujin.data?.cover.url}`}
                  />
               </Col>
               <Col className="py-2 d-flex flex-column gap-3">
                  <div className="lead bg-primary rounded p-2">
                     {showTitle()}
                  </div>
                  <div className="bg-info rounded p-2">
                     <div className="fw-bold mb-2">Tags:</div>
                     <div className="d-inline-flex gap-2 flex-wrap">
                        {doujin.data?.tags.all
                           .filter((e) => e.type === 'tag')
                           .map((e) => (
                              <Link
                                 key={e.id}
                                 className="btn btn-light p-1"
                                 to={new URL(e.url)}
                              >
                                 {e.name}
                              </Link>
                           ))}
                     </div>
                  </div>
                  <div className="bg-info rounded p-2">
                     <span className="fw-bold mb-2">Artist: </span>
                     <Link
                        className="text-success"
                        to={
                           new URL(
                              doujin.data?.tags.all.find(
                                 (e) => e.type === 'artist'
                              )?.url as string
                           )
                        }
                     >
                        {
                           doujin.data?.tags.all.find(
                              (e) => e.type === 'artist'
                           )?.name
                        }
                     </Link>
                  </div>
                  <div className="bg-info rounded p-2">
                     <span className="fw-bold mb-2">Upload Date: </span>
                     {new Date(doujin.data?.uploadDate).toUTCString()}
                  </div>
               </Col>
            </Row>
         )}
      </Container>
   );
};

export default DoujinPage;
