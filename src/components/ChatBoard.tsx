import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  Container,
  Col,
  InputGroup,
  Row,
  FormControl,
  Button,
  Form,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomById } from '../store/slices/room';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { addMessage } from '../store/slices/room';
import store, { AppDispatch, RootState } from '../store';
import { MessageFactory } from './Messages/MessageFactory';
import { TMessage, TNotificationEvent } from '../types';
import { eventBus } from '../utils/eventBus';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { getPreviousMessages } from '../store/slices/message';

type TContext = {
  context: string;
};

export const ChatBoard = () => {
  let { roomId } = useParams<{ roomId: string | undefined }>();
  const { me } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const room = useSelector((state: RootState) =>
    getRoomById(state.room, roomId!)
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, reset } = useForm<TContext>({
    defaultValues: {
      context: '',
    },
  });

  const sumbitMessage: SubmitHandler<TContext> = (data: TContext) => {
    if (data.context.trim() === '') return;
    const newMessageObj = {
      context: data.context,
      chatRoomId: room._id,
      senderId: me?._id,
      receiverId: room?.users[0]._id,
      tempId: uuidv4(),
    } as TMessage;
    dispatch(addMessage(newMessageObj));
    reset({ context: '' });
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  eventBus.on('onScrollToBottomEvent', scrollToBottom);

  useEffect(() => {
    if (!room) {
      navigate('/chat');
      return;
    }
  }, [room]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesContainerRef.current!.onscroll = async function () {
      if (messagesContainerRef.current?.scrollTop === 0) {
        const selectedRoom = store.getState().room.rooms[room._id];
        const lastMessage = selectedRoom.messages![0];
        const previousLength = selectedRoom.messages?.length;
        await dispatch(
          getPreviousMessages({
            roomId: room._id,
            lastMessageDateTime: lastMessage.createdAt,
          })
        );
        const updatedRoom = store.getState().room.rooms[room._id];
        const updatedLength = updatedRoom.messages?.length;
        if (previousLength === updatedLength) { 
          eventBus.emit('addNotification', {text: 'No history messages', variant:"info"} as TNotificationEvent);
        }
  

      }
    };
    scrollToBottom();
  }, []);

  return (
    <>
      {room && (
        <>
          <div className="d-flex flex-row-reverse bd-highlight">
            <div className="d-block d-lg-none">
              <NavLink to={'/chat'}>
                <Button>{'<'}</Button>
              </NavLink>
            </div>
            <div className="p-1 flex-fill text-center">
              <b>{room?.users[0].firstName}</b>
            </div>
          </div>

          <Container
            fluid
            ref={messagesContainerRef}
            style={{
              marginTop: '10px',
              overflowY: 'auto',
              flexDirection: 'column',
              minHeight: '75vh',
              maxHeight: '75vh',
            }}
          >
            {room.messages?.map((message: TMessage) => (
              <Row key={uuidv4()}>
                <MessageFactory message={message}></MessageFactory>
              </Row>
            ))}
            <Row ref={messagesEndRef}></Row>
          </Container>

          <Container className="mt-2">
            <Row>
              {/* Message input box */}
              <Col>
                <Form onSubmit={handleSubmit(sumbitMessage)}>
                  <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Controller
                      name="context"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputGroup>
                            <FormControl
                              type="text"
                              {...field}
                              placeholder="Type your message..."
                            />
                            <Button variant="primary" type={'submit'}>
                              Send
                            </Button>
                          </InputGroup>
                        </>
                      )}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};
