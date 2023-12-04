import { Badge, ListGroup, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { TRoom } from '../types';
import { useRef } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getMessageByRoomId } from '../store/slices/message';

export const RoomListNavItem = ({ room }: { room: TRoom }) => {
  const lastActiveTime = useRef(moment.utc().toISOString());

  const getClassName = (isActive: boolean) => {
    return `d-flex justify-content-between align-items-start list-group-item  ${
      isActive ? 'active' : ''
    } `;
  };
  const messages = useSelector((state: RootState) =>
    getMessageByRoomId(state.message, room._id)
  ).filter((m) => moment.utc(m.createdAt).isAfter(lastActiveTime.current));

  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : undefined;

  const linkOnClick = () => {
    lastActiveTime.current = moment.utc().toISOString();
  };

  return (
    <NavLink
      style={{ textDecoration: 'none' }}
      to={`/chat/${room._id}`}
      key={room._id}
    >
      {({ isActive }) => (
        <ListGroup.Item
          as="li"
          className={getClassName(isActive)}
          onClick={linkOnClick}
        >
          <Row>
            <div className="fw-bold">
              {room.users[0].firstName}
              {!isActive && lastMessage && (
                <div className=" float-end">
                  <Badge bg="danger" pill>
                    {messages.length}
                  </Badge>
                </div>
              )}
            </div>
            <div className="text-truncate">
              {lastMessage && lastMessage.context}
            </div>
          </Row>
        </ListGroup.Item>
      )}
    </NavLink>
  );
};
