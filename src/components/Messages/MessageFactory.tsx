import './message.css'
import { TMessage } from '../../types';
import { SentMessage } from './SentMessage';
import { NewMessage } from './NewMessage';

export function MessageFactory({ message }: { message: TMessage }) {
  const getMessageComponent = (message: TMessage) => {
    if (message._id) {
      return <SentMessage message={message}></SentMessage>;
    } else if (message.tempId) {
      return <NewMessage message={message}></NewMessage>;
    }
    return null;
  };
  return (
    <>
      {getMessageComponent(message)}
    </>
  );
}
