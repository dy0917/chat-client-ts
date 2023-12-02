import { Badge, Col } from 'react-bootstrap';
import { TMessage } from '../../store/slices/message';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const BasicMessage = ({ message }: { message: TMessage }) => {
  const { me } = useSelector((state: RootState) => state.auth);
  return (
    <Col>
  
      <h2 className={me!._id == message.senderId ? 'float-end' : ''}>
        <Badge pill bg={me!._id == message.senderId ? 'primary' : 'secondary'}>
          {message.context}
        </Badge>
      </h2>
    </Col>
  );
};
