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
import { useSelector } from 'react-redux';
import { getRoomById } from '../store/slices/room';
import { useParams } from 'react-router-dom';
interface Message {
  text: string;
  sender: string;
}

type ChatBoard = {
  roomId: string;
};
export const ChatBoard = () => {
  let { roomId } = useParams();
  console.log(roomId);

  const room = useSelector(getRoomById(roomId!));
  console.log('room', room);
  const { socket } = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const addMessage = async () => {
    if (newMessage.trim() === '') return;
    console.log('655e85bc3425e48e19e7f07d');
    console.log(' room.users[0]._id', room.users[0]._id);
    const updatedMessages = [...messages, { text: newMessage, sender: 'user' }];
    socket.emit(
      'sendMessage',
      { message: newMessage, roomId: room._id, receiverId: room.users[0]._id },
      (message: any) => {
        console.log(message);
      }
    );
    await setMessages(updatedMessages);
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
        {messages.map((message, index) => (
          <Row key={index}>
            <Col>
              <h2 className="float-end">
                <Badge pill>{message.text}</Badge>
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
              <Button variant="primary" onClick={addMessage}>
                Send
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};
