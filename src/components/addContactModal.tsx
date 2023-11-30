import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { eventBus } from '../utils/eventBus';
import { SearchContacts } from './searchContacts';
import { TUser } from '../types/user';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { newContact } from '../store/slices/room';
import { LoadingButton } from './LoadingButton';
function AddContactModal() {
  const [show, setShow] = useState(false);
  const [contact, setContact] = useState<TUser | undefined>(undefined);
  const { status } = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch<AppDispatch>();
  const handleClose = () => setShow(false);

  const onSelectContact = (contact: TUser) => {
    setContact(contact);
  };

  const onAdd = async () => {
    dispatch(newContact({ receiverId: contact!._id }));
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  eventBus.on('showContactModal', handleShow);
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchContacts onSelectContact={onSelectContact} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton
            onClick={onAdd}
            status={status}
            text={'Add'}
            disabled={contact == undefined}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddContactModal;
