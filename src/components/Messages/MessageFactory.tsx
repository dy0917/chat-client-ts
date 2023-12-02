
import { TMessage } from '../../store/slices/message';
import { BasicMessage } from './BasicMessage';
import { NewMessage } from './NewMessage';

export function MessageFactory({ message }: { message: TMessage }) {
  const getMessageComponent = (message: TMessage) => {
    if (message._id) {
      return <BasicMessage message={message}></BasicMessage>;
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
