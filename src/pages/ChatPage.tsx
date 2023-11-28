import { useEffect } from 'react';
import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { useSocketContext } from '../store/socketContext';
import Example from '../components/addContactModal';
import { RoomCol } from '../components/RoomCol';
import { Outlet } from 'react-router-dom';


const ChatPage = () => {
  const { socket, initSocket } = useSocketContext();
  useEffect(() => {
    initSocket();
  }, []);

  return (
    <>
      <Container className="mt-2">
        <Row className="justify-content-center">
          <Col md={8}>
            <Row>
              <Col md={4}>
                <RoomCol></RoomCol>
              </Col>
              <Col>
                <Outlet></Outlet>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Example></Example>
    </>
  );
};

export default ChatPage;
