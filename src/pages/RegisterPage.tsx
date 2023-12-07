import { Container, Row, Form, Col } from 'react-bootstrap';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { registerAsync } from '../store/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import store, { AppDispatch, RootState } from '../store';
import { NavLink, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { LoadingButton } from '../components/LoadingButton';
import { eventBus } from '../utils/eventBus';
type TRegistrationFormInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  repeatPassword: string;
};

const RegistationFormSchema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase and One Number'
      ),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    repeatPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required();

function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const {
    control,
    formState: { isValid, errors },
    watch,
    handleSubmit,
  } = useForm<TRegistrationFormInput>({
    resolver: yupResolver(RegistationFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const { status } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const subscription = watch(() => {
      setServerError(undefined);
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  const handleRegistration: SubmitHandler<TRegistrationFormInput> = async (
    data
  ) => {
    if (isValid) {
      await dispatch(registerAsync(data));
      const status = store.getState().auth.status;
      if (status == 'failed') {
        setServerError('Email existed please try login again later');
        return;
      }
      eventBus.emit('addNotification', {
        text: 'Account Created! 🎉 Welcome! Please log in to start',
        variant: 'success',
      });
      navigate('/');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={{ span: 6 }}>
          <Form onSubmit={handleSubmit(handleRegistration)}>
            <h2 className="text-center mb-4">Sign up</h2>
            <Row>
              <Col>
                <Form.Group controlId="formGroupFirstName">
                  <Form.Label className="form-label-left">
                    First name
                  </Form.Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        className={errors.firstName ? 'is-invalid' : ''}
                        {...field}
                      />
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label className="form-label-left">Last name</Form.Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        className={errors.lastName ? 'is-invalid' : ''}
                        {...field}
                      />
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
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
            <Form.Group className="mb-3">
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

            <Form.Group className="mb-3">
              <Form.Label className="form-label-left">
                Repeat password
              </Form.Label>
              <Controller
                name="repeatPassword"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    type="password"
                    className={errors.repeatPassword ? 'is-invalid' : ''}
                    {...field}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {errors.repeatPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>
            {serverError && (
              <div className="is-invalid text-danger">{serverError}</div>
            )}
            <Row>
              <Col className="d-grid gap-2">
                <LoadingButton
                  type={'submit'}
                  status={status}
                  text={'Register'}
                  disabled={false}
                />
              </Col>
            </Row>

            <Row>
              <Col className="text-center">
                Already has an account, <NavLink to={'/'}>login</NavLink>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
