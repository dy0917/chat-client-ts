import { Container, Row, Form, Col } from 'react-bootstrap';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { loginAsync } from '../store/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import store, { AppDispatch, RootState } from '../store';
import { NavLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { LoadingButton } from '../components/LoadingButton';
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
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const {
    control,
    watch,
    formState: { isValid, errors },
    handleSubmit,
  } = useForm<TLoginFormInput>({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { status, token } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (token) {
      navigate('/chat');
    }
  }, []);

  const handleLogin: SubmitHandler<TLoginFormInput> = async (data) => {
    if (isValid) {
      await dispatch(loginAsync(data));
      const status = store.getState().auth.status;
      if (status == 'failed') {
        setServerError('Email or password is not correct.');
        return;
      }
      navigate('/chat');
    }
  };
  useEffect(() => {
    const subscription = watch(() => {
      setServerError(undefined);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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
                    type="password"
                    className={errors.password ? 'is-invalid' : ''}
                    {...field}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            {serverError && (
              <div className="is-invalid text-danger">{serverError}</div>
            )}
            <Row>
              <Col className="d-grid gap-2">
                <LoadingButton type={'submit'} status={status} text={'Login'} />
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                Don't have an account <NavLink to={'/signup'}>sign up</NavLink>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
