import { Badge, Container, ListGroup } from 'react-bootstrap';
import { TMessage, TRoom } from '../types';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  getMessagesByRoomId,
} from '../store/slices/room';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

export const RoomListNavItem = ({
  room,
  isActive,
}: {
  room: TRoom;
  isActive: boolean;
}) => {
  const lastActive = useRef(moment.utc().toISOString());
  const tempMessages = useSelector((state: RootState) =>
    getMessagesByRoomId(state.room, room._id)
  );
  const [messages, setMessages] = useState(tempMessages);
  useEffect(() => {
    if (!isActive) {
      setMessages(
        tempMessages!.filter((message: TMessage) =>
          moment.utc(message.createdAt).isAfter(lastActive.current)
        )
      );
    } else {
      lastActive.current = moment.utc().toISOString();
      setMessages([]);
    }
  }, [isActive,tempMessages]);

  const getClassName = (isActive: boolean) => {
    return `d-flex list-group-item  ${isActive ? 'active' : ''} `;
  };

  const lastMessage =
    messages!.length > 0 && !isActive
      ? messages![messages!.length - 1]
      : undefined;

  return (
    <ListGroup.Item as="li" className={getClassName(isActive)}>
      <Container>
        <div className="fw-bold">
          {room.users[0].firstName}
          {lastMessage && (
            <div className="float-end">
              <Badge bg="danger" pill>
                {messages!.length}
              </Badge>
            </div>
          )}
        </div>
        <div className="text-truncate">
          {lastMessage && lastMessage.context}
        </div>
      </Container>
    </ListGroup.Item>
  );
};
