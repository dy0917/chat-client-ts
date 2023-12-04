import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Container,
  Col,
  InputGroup,
  Row,
  FormControl,
  Button,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomById } from '../store/slices/room';
import { NavLink, useParams } from 'react-router-dom';
import { addMessage, getMessageByRoomId } from '../store/slices/message';
import { RootState } from '../store';
import { MessageFactory } from './Messages/MessageFactory';
import { TMessage } from '../types';

export const ChatBoard = () => {
  let { roomId } = useParams<{ roomId: string | undefined }>();
  const { me } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const room = useSelector((state: RootState) =>
    getRoomById(state.room, roomId!)
  );

  const messages = useSelector((state: RootState) =>
    getMessageByRoomId(state.message, roomId!)
  );

  const contact = room.users[0];

  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sumbitMessage = async () => {
    if (newMessage.trim() === '') return;

    const newMessageObj = {
      context: newMessage,
      chatRoomId: room._id,
      senderId: me?._id,
      receiverId: room.users[0]._id,
      tempId: uuidv4(),
    };

    dispatch(addMessage(newMessageObj));
    setNewMessage('');
    // Scroll to the bottom when a new message is added
    scrollToBottom();
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect to scroll to the bottom when the component mounts
  useEffect(() => {
    scrollToBottom();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div className="d-flex flex-row-reverse bd-highlight">
        <div className="d-block d-xl-none">
          <NavLink to={'/chat'}>
            <Button>{'<'}</Button>
          </NavLink>
        </div>
        <div className="p-1 flex-fill text-center">
          <b>{contact.firstName}</b>
        </div>
      </div>

      <Container
        fluid
        style={{
          marginTop: '10px',
          overflowY: 'auto',
          flexDirection: 'column',
          minHeight: '80vh',
          maxHeight: '80vh',
        }}
      >
        {/* Message list */}

        {messages.map((message: TMessage) => (
          <Row key={uuidv4()}>
            <MessageFactory
              message={message}
            ></MessageFactory>
          </Row>
        ))}
        <div ref={messagesEndRef} />
      </Container>

      <Container className="mt-2">
        <Row>
          {/* Message input box */}
          <Col>
            <InputGroup>
              <FormControl
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <Button variant="primary" onClick={sumbitMessage}>
                Send
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};
