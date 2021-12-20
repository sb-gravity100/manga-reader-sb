import { ToastContainer, Toast } from 'react-bootstrap';
import { useToggle } from 'react-use';
import { useSelector } from '../../store';
import timeAgo from '../../timeAgo';

export const NoteToast: React.FC<{
   id: any;
   header: string;
   message: string;
   createdAt: number;
   delay?: number;
}> = (props) => {
   const [show, setShow] = useToggle(true);
   return (
      <Toast
         onClose={() => setShow(false)}
         show={show}
         animation
         autohide={!!props.delay}
         delay={props.delay}
      >
         <Toast.Header>
            <img src="/favicon.png" height="20" className="me-2" alt="Logo" />
            <strong className="me-auto">{props.header}</strong>
            <small className="text-muted">
               {timeAgo.format(props.createdAt)}
            </small>
         </Toast.Header>
         <Toast.Body>{props.message}</Toast.Body>
      </Toast>
   );
};

const ToastArea: React.FC = () => {
   const toasts = useSelector((state) => state.downloads.toasts);

   return (
      <ToastContainer
         style={{ zIndex: 10000 }}
         position="bottom-end"
         className="p-3 position-fixed"
      >
         {/* <Toast>
            <Toast.Header>
               <img
                  src="/favicon.png"
                  height="20"
                  className="me-2"
                  alt="Logo"
               />
               <strong className="me-auto">Ora!</strong>
               <small className="text-muted">
                  {timeAgo.format(new Date())}
               </small>
            </Toast.Header>
            <Toast.Body>Ora Ora Ora Ora Ora!</Toast.Body>
         </Toast> */}
         {toasts.map((e) => (
            <NoteToast key={e.id} {...e} />
         ))}
      </ToastContainer>
   );
};

export default ToastArea;
