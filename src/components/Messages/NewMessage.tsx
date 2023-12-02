import { Badge, Col, Spinner } from 'react-bootstrap';
import { TMessage, updateTempMessage } from '../../store/slices/message';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useSocketContext } from '../../store/socketContext';
import { useEffect } from 'react';

export const NewMessage = ({ message }: { message: TMessage }) => {
  const { me } = useSelector((state: RootState) => state.auth);
  const { socket } = useSocketContext();
  const dispatch = useDispatch();
  useEffect(() => {
    socket.emit(
      'sendMessage',
      message,
      (response: { status: string; message: TMessage }) => {
        dispatch(
          updateTempMessage({ ...response.message, tempId: message.tempId })
        );
      }
    );
  }, []);
  return (
    <Col key={message._id}>
      <h2 className={me!._id == message.senderId ? 'float-end' : ''}>
        <Spinner animation="border" role="status" size="sm" variant="secondary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <Badge pill bg={me!._id == message.senderId ? 'primary' : 'secondary'}>
          {message.context}
        </Badge>
      </h2>
    </Col>
  );
};
