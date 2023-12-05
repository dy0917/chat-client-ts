import { Badge, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { TRoom } from '../types';

import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getIncomeingMessageByRoomId } from '../store/slices/message';

export const RoomListNavItem = ({
  room,
  isActive,
  lastActive,
}: {
  room: TRoom;
  isActive: boolean;
  lastActive: string;
}) => {
  const getClassName = (isActive: boolean) => {
    return `d-flex list-group-item  ${
      isActive ? 'active' : ''
    } `;
  };

  const messages = useSelector((state: RootState) =>
    getIncomeingMessageByRoomId(state.message, room._id, lastActive.toString())
  );

  const lastMessage =
    messages.length > 0 && !isActive
      ? messages[messages.length - 1]
      : undefined;

  return (
    <ListGroup.Item as="li" className={getClassName(isActive)}>
      <Container>

          <div className="fw-bold">
            {room.users[0].firstName}
            {lastMessage && (
              <div className="float-end">
                <Badge bg="danger" pill>
                  {messages.length}
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
