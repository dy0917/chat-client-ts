import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { eventBus } from '../utils/eventBus';
import { TRoom } from '../types';
import { RoomListNavItem } from './RoomListNavItem';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

export const RoomCol = () => {
  const { rooms } = useSelector((state: RootState) => state.room);
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
          {rooms.map((room: TRoom) => (
                <NavLink
                style={{ textDecoration: 'none' }}
                to={`/chat/${room._id}`}
                key={room._id}
              >
                {({ isActive }) => (
                <RoomListNavItem room={room} isActive={isActive} lastActive={ moment.utc().toISOString()} />
                )}
              </NavLink>
          ))}
        </ListGroup>
      </Row>
    </Container>
  );
};
