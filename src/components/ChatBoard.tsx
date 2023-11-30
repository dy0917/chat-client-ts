import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Col,
  InputGroup,
  Row,
  FormControl,
  Button,
  Badge,
} from 'react-bootstrap';
import { useSocketContext } from '../store/socketContext';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomById } from '../store/slices/room';
import { useParams } from 'react-router-dom';
import {
  TMessage,
  addMessage,
  getMessageByRoomId,
} from '../store/slices/message';
import { RootState } from '../store';

export const ChatBoard = () => {
  let { roomId } = useParams<{ roomId: string }>();
  const { me } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const room = useSelector(getRoomById(roomId!));
  const messages = useSelector(getMessageByRoomId(roomId!));
  const { socket } = useSocketContext();

  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sumbitMessage = async () => {
    if (newMessage.trim() === '') return;
    // const updatedMessages = [...messages, { text: newMessage, sender: 'user' }];
    socket.emit(
      'sendMessage',
      {
        context: newMessage,
        chatRoomId: room._id,
        senderId: me?._id,
        receiverId: room.users[0]._id,
      },
      (response: { status: string; message: TMessage }) => {
        dispatch(addMessage(response.message));

      }
    );
    // await setMessages(updatedMessages);
    setNewMessage('');
    // Scroll to the bottom when a new message is added
    scrollToBottom();
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    //   var objDiv = document.getElementById("your_div");
    //   messagesEndRef.current?.scrollTop = messagesEndRef.current?.scrollHeight;

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect to scroll to the bottom when the component mounts
  useEffect(() => {
    scrollToBottom();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
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
          <Row key={message._id}>
            <Col>
              <h2 className={me!._id == message.senderId ? 'float-end' : ''}>
                <Badge pill bg={me!._id == message.senderId ? 'primary' : 'secondary'}>
                  {message.context}
                </Badge>
              </h2>
            </Col>
          </Row>
        ))}
        <div ref={messagesEndRef} />
      </Container>

      <Container className="bottom-0">
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
