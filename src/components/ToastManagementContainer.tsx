import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer } from 'react-bootstrap';
import ToastItem from './ToastItem';
import { eventBus } from '../utils/eventBus';
import { TNotification } from '../types/notification';
import moment from 'moment';
import { TNotificationEvent } from '../types';

function ToastManagementContainer() {
  const [toastList, setToastList] = useState<Array<TNotification>>([]);

  const addNotification = (data: TNotificationEvent) => {
    const toast: TNotification = { id: uuidv4(), ...data, createdOn: moment.utc().toISOString() };
    setToastList([...toastList, toast])
  };
  eventBus.on('addNotification', addNotification);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
      {toastList.map((t:TNotification) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </ToastContainer>
  );
}

export default ToastManagementContainer;
