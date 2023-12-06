import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { eventBus } from '../utils/eventBus';
import { TRoom } from '../types';
import { RoomListNavItem } from './RoomListNavItem';
import { NavLink } from 'react-router-dom';
import { allRooms } from '../store/slices/room';
import moment from 'moment';

export const RoomCol = () => {
  const selectedRooms = Object.values(
    useSelector((state: RootState) => allRooms(state.room))
  );

  const rooms = selectedRooms.sort((room1, room2) => {
    if (!room1.messages || room1.messages?.length === 0) return 1;
    if (!room2.messages || room2.messages?.length === 0) return -1;
    const room1LastMessage = room1.messages![room1.messages!.length - 1];
    const room2LastMessage = room2.messages![room2.messages!.length - 1];
    return moment
      .utc(room1LastMessage.createdAt)
      .isAfter(room2LastMessage.createdAt)
      ? -1
      : 1;
  });

  const onShow = () => {
    eventBus.emit('showContactModal');
  };

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
          {Object.values(rooms).map((room: TRoom) => (
            <NavLink
              style={{ textDecoration: 'none' }}
              to={`/chat/${room._id}`}
              key={room._id}
              onClick={() => console.log('click')}
            >
              {({ isActive }) => (
                <RoomListNavItem room={room} isActive={isActive} />
              )}
            </NavLink>
          ))}
        </ListGroup>
      </Row>
    </Container>
  );
};
