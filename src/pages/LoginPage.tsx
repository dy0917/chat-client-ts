import '../App.css';
import { Container, Row, Form, Col, Button } from 'react-bootstrap';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { loginAsync } from '../store/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
type TLoginFormInput = {
  email: string;
  password: string;
};

const loginFormSchema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    control,
    formState: { isValid, errors },
    handleSubmit,
  } = useForm<TLoginFormInput>({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '12@agga.com',
      password: 'Password1',
    },
  });

  const { me, status, error, token } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (token) { 
      navigate('/chat');
  }
  }, []);

  
  useEffect(() => {
    if (me && token && !error) { 
      navigate('/chat');
    }
   }, [me,token, error]);

  const handleLogin: SubmitHandler<TLoginFormInput> = async (data) => {

      if (isValid) {
        await dispatch(loginAsync(data));
      }


  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={{ span: 8 }}>
          <Form onSubmit={handleSubmit(handleLogin)}>
            <h2 className="text-center mb-4">Login</h2>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label className="form-label-left">Email address</Form.Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    className={errors.email ? 'is-invalid' : ''}
                    {...field}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label className="form-label-left">Password</Form.Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    type='password'
                    className={errors.password ? 'is-invalid' : ''}
                    {...field}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" disabled={!isValid}>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
