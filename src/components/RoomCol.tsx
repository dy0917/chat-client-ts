import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { eventBus } from '../utils/eventBus';
import { TRoom } from '../types';
import { RoomListNavItem } from './RoomListNavItem';

export const RoomCol = () => {
  const { rooms } = useSelector((state: RootState) => state.room);
  const onShow = () => {
    eventBus.emit('showContactModal');
  };

  // const getClassName = (isActive: boolean) => {
  //   return `d-flex justify-content-between align-items-start list-group-item  ${
  //     isActive ? 'active' : ''
  //   } `;
  // };
  return (
    <Container
      fluid
      style={{
        overflowY: 'auto',
        flexDirection: 'column',
        minHeight: '85vh',
        maxHeight: '85vh',
      }}
    >
      <Row className="mb-2">
        <Col className=" ps-0">
          <Button
            variant="outline-secondary"
            className="float-end"
            onClick={onShow}
          >
            +
          </Button>
        </Col>
      </Row>
      <Row>
        <ListGroup as="ol">
          {rooms.map((room: TRoom) => (
            <RoomListNavItem room={room} key={ room._id} />
          ))}
        </ListGroup>
      </Row>
    </Container>
  );
};
