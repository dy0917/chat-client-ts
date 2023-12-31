import { Spinner } from 'react-bootstrap';
import { updateTempMessage } from '../../store/slices/room';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useSocketContext } from '../../store/socketContext';
import { useEffect, useState } from 'react';
import { TMessage } from '../../types';
import { eventBus } from '../../utils/eventBus';
import { Message } from './BasicMessage';

export const NewMessage = ({ message }: { message: TMessage }) => {
  const { me } = useSelector((state: RootState) => state.auth);
  const { socket } = useSocketContext();
  const [isLoading, setLoading] = useState(false);
  const [doesShowResendButton, setDoesShowResendButton] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (message.tempId) sendMessage();
  }, []);

  const sendMessage = () => {
    setLoading(true);
    socket.emit(
      'sendMessage',
      message,
      (response: { status: string; message: TMessage; }) => {
        if (response.status.toString().toLowerCase() == '200') {
          dispatch(
            updateTempMessage({
              ...response.message,
              tempId: message.tempId,
            })
          );
        } else {
          setDoesShowResendButton(true);
        }
        eventBus.emit('onScrollToBottomEvent');
        setLoading(false);
        setDoesShowResendButton(false);
      }
    );
  };

  const resendOnClick = () => {
    setDoesShowResendButton(false);
    sendMessage();
  };
  return (
    <div className="d-flex justify-content-end">
      {isLoading && (
        <span
          className="mb-2 me-1"
          style={{
            fontSize: 'smaller',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Spinner
            animation="border"
            role="status"
            size="sm"
            variant="secondary"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </span>
      )}
      {doesShowResendButton && (
        <span
          className="mb-2 me-1"
          onClick={resendOnClick}
          style={{
            fontSize: 'smaller',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h4 className="m-0">
            <i className="bi bi-arrow-counterclockwise"></i>
          </h4>
        </span>
      )}
      <Message sender={me!} message={message}></Message>
    </div>
  );
};
