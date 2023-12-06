import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TMessage } from '../../types';
import { getExistedContactById } from '../../store/slices/contact';
import { Message } from './BasicMessage';

export const SentMessage = ({ message }: { message: TMessage }) => {
  const { me } = useSelector((state: RootState) => state.auth);
  const contact = useSelector((state: RootState) => {
   return  getExistedContactById(state.contacts, message.senderId);
  }
  );

  const sender = () => (me!._id == message.senderId ? me : contact);
  return <Message sender={sender()} message={message}></Message>;
};
