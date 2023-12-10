import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TMessage, TUser } from '../../types';
import Avatar from 'react-avatar';
import moment from 'moment';

export const Message = ({
  sender,
  message,
}: {
  sender: TUser;
  message: TMessage;
}) => {
  const { me } = useSelector((state: RootState) => state.auth);
  const isSender = () => sender!._id == me?._id;
  const avatarName = () => {
    return `${sender!.firstName} ${sender!.lastName}`;
  };
  return (
    <div className={`d-flex mt-2 ${isSender() ? 'flex-row-reverse' : ''} `}>
      <div className="mt-4">
        <Avatar name={avatarName()} size="45" />
      </div>
      <div>
        <div className={`ms-1 me-2`}>
          <div className={`ms-1 me-3 text-end`}>
            <small>
              {moment(message.createdAt).fromNow()}
            </small>
          </div>

          <div className={`d-flex ${isSender() ? 'flex-row-reverse' : ''}`}>
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
    </div>
  );
};
