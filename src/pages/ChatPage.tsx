import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Badge,
} from 'react-bootstrap';
import { useSocketContext } from '../store/socketContext';

interface Message {
  text: string;
  sender: string;
}

const ChatPage = () => {
  const { socket, initSocket} = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initSocket();
   },[])
  // Function to add a new message to the chat
  const addMessage = () => {
    if (newMessage.trim() === '') return;

    const updatedMessages = [...messages, { text: newMessage, sender: 'user' }];
    setMessages(updatedMessages);
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

export default ChatPage;
