import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { eventBus } from '../utils/eventBus';
import { NavLink } from 'react-router-dom';
import { TRoom } from '../types';
import { RoomListNavItem } from './RoomListNavItem';

export const RoomCol = () => {
  const { rooms } = useSelector((state: RootState) => state.room);
  const onShow = () => {
    eventBus.emit('showContactModal');
  };

  const getClassName = (isActive: boolean) => {
    return `d-flex justify-content-between align-items-start list-group-item  ${
      isActive ? 'active' : ''
    } `;
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
            <RoomListNavItem room={room} key={ room._id} />
            // <NavLink
            //   style={{ textDecoration: 'none' }}
            //   to={`/chat/${room._id}`}
            //   key={room._id}
            // >
            //   {({ isActive }) => (
            //     <ListGroup.Item as="li" className={getClassName(isActive)}>
            //       <div className="ms-2 me-auto">
            //         <div className="fw-bold"> {room.users[0].firstName}</div>
            //         last message time
            //         {/* {room.users[0].firstName} */}
            //       </div>
            //       {/*                           
            // <Badge bg="primary" pill>
            //   14
            // </Badge> */}
            //     </ListGroup.Item>
            //   )}
            // </NavLink>
          ))}
        </ListGroup>
      </Row>
    </Container>
  );
};
