import { TMessage, TUser } from '../../types';
import Avatar from 'react-avatar';

export const Message = ({
  sender,
  message,
}: {
  sender: TUser;
  message: TMessage;
}) => {
  const isSender = () => sender!._id == message.senderId;

  const avatarName = () => {
    return `${sender!.firstName} ${sender!.lastName}`;
  };
  return (
    <div className={`d-flex mt-2 ${isSender() ? 'flex-row-reverse' : ''} `}>
      <div>
        <Avatar name={avatarName()} size="45" />
      </div>
      <div>
        <div
          className={`d-flex ms-1 me-2 ${
            isSender() ? 'flex-row-reverse' : ''
          }`}
        >
          <div
            className={`${isSender() ? 'triangleRight' : 'triangleLeft'}`}
          />
          <div>
            <div
              className={`text-break p-2 text-white rounded-4 ${
                isSender() ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <h2>{message.context}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
