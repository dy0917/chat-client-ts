import '../App.css';
import { Container, Row, Form, Col, Button } from 'react-bootstrap';
import {
  incrementAsync,
} from '../store/slices/counterSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';


function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission behavior
    // console.log('context?.socketObject.socket!.id', socket!.id);

    try {


      dispatch(incrementAsync());
      // navigate('/chat');
      // Add your login logic here
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 8 }}>
          <Form onSubmit={(e) => handleLogin(e)}>
            <h2 className="text-center mb-4">
              Create your account
            </h2>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label className="form-label-left">First name</Form.Label>
              <Form.Control
                name="firName"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label className="form-label-left">Last name</Form.Label>
              <Form.Control
                name="lastName"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label className="form-label-left">Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label className="form-label-left">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
              />
            </Form.Group>
            <Button type="submit">Register</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
