import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { RootState } from '.';
import { addMessage, addRoom } from './slices/room';
import { addContact } from './slices/contact';

type SocketContextProps = {
  socket: Socket;
  initSocket: () => void;
};
const ENDPOINT = 'http://localhost:5000';
export const SocketContext = createContext<SocketContextProps | undefined>(
  undefined
);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [socket, setSocket] = useState<Socket | undefined>();
  const dispatch = useDispatch();
  const initSocket = () => {
    const tSocket = io(ENDPOINT, {
      transports: ['websocket', 'polling'],
      query: {
        token,
      },
    });
    tSocket.on('receiveMessge', (msg) => {
      dispatch(addMessage(msg));
    });

    tSocket.on('addRoom', (room) => {
      dispatch((addRoom(room)));
      dispatch((addContact(room.users[0])));
    });
    setSocket(tSocket);
  };

  return (
    <SocketContext.Provider value={{ socket: socket!, initSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

