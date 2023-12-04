import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TMessage } from '../../types';
import Avatar from 'react-avatar';
import { getExistedContactById } from '../../store/slices/contact';

export const BasicMessage = ({ message }: { message: TMessage }) => {
  const { me } = useSelector((state: RootState) => state.auth);
  const contact = useSelector((state: RootState) =>
    getExistedContactById(state.contacts, message.senderId)
  );
  const isLoginUser = () => me!._id == message.senderId;

  const avatarName = () => {
    if (isLoginUser()) return `${me!.firstName} ${me!.lastName}`;
    return `${contact!.firstName} ${contact!.lastName}`;
  };
  return (
    <div className={`d-flex mt-2 ${isLoginUser() ? 'flex-row-reverse' : ''} `}>
      <div>
        <Avatar name={avatarName()} size="45" />
      </div>

      <div className=" ms-2 me-2">
        <div
          className={`text-break p-2 text-white ${
            isLoginUser() ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          <h2>
            {message.context}
          </h2>
        </div>
      </div>
    </div>
  );
};
