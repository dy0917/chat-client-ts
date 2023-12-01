import { useEffect, useState } from 'react';
import { Toast } from 'react-bootstrap';
import { TNotification } from '../types/notification';
import moment from 'moment';

function ToastItem(nofitication: TNotification) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);
  return (
    <Toast
      // bg={nofitication.variant?.toLowerCase()}
      onClose={() => {
        setShow(false);
      }}
      show={show}
      delay={3000}
      autohide
    >
      <Toast.Header className={`bg-${nofitication.variant?.toLowerCase()}`}>
        <strong className="me-auto"></strong>
        <small className="text-muted">
          {moment(nofitication.createdOn).fromNow()}
        </small>
      </Toast.Header>
      <Toast.Body>{nofitication.text}</Toast.Body>
    </Toast>
  );
}

export default ToastItem;
