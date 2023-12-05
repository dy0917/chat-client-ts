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
import { NavLink, useParams } from 'react-router-dom';
import { addMessage } from '../store/slices/room';
import { RootState } from '../store';
import { MessageFactory } from './Messages/MessageFactory';
import { TMessage } from '../types';
import { eventBus } from '../utils/eventBus';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

type TContext = {
  context: string;
};

export const ChatBoard = () => {
  let { roomId } = useParams<{ roomId: string | undefined }>();
  const { me } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const room = useSelector((state: RootState) =>
    getRoomById(state.room, roomId!)
  );

  const contact = room.users[0];

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
      receiverId: room.users[0]._id,
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
    scrollToBottom();
  }, [room.messages]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div className="d-flex flex-row-reverse bd-highlight">
        <div className="d-block d-xl-none">
          <NavLink to={'/chat'}>
            <Button>{'<'}</Button>
          </NavLink>
        </div>
        <div className="p-1 flex-fill text-center">
          <b>{contact.firstName}</b>
        </div>
      </div>

      <Container
        fluid
        style={{
          marginTop: '10px',
          overflowY: 'auto',
          flexDirection: 'column',
          minHeight: '78vh',
          maxHeight: '78vh',
        }}
      >
        {room.messages!.map((message: TMessage) => (
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
  );
};
