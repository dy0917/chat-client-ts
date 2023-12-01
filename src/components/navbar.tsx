import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { Nav, NavDropdown } from 'react-bootstrap';
import { clearToken } from '../store/slices/auth';

export const TopNavbar = () => {
  const { me } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(clearToken());
    navigate('/');
  };
  return (
    <>
      <div className="d-none d-lg-block">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#">Chat system</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" className="me-3" />
            <Navbar.Collapse id="navbarScroll">
              <NavDropdown
                className="ms-auto"
                align={'end'}
                title={`Hi, ${me!.firstName}`}
                id={`offcanvasNavbarDropdown-expand-xl`}
              >
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <div className="d-block d-lg-none">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">Chat system</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto ">
                <a onClick={logout}>Logout</a>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <Outlet></Outlet>
    </>
  );
};
