import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState } from '../store';
import { Button, Form, Nav, NavDropdown } from 'react-bootstrap';

export const TopNavbar = () => {
  const { me } = useSelector((state: RootState) => state.auth);
  return (
    <div>
      <div className="d-none d-sm-block">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#">Chat system</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" className="me-3" />
            <Navbar.Collapse id="navbarScroll">
              <NavDropdown
                className="ms-auto"
                align={'end'}
                title={`Hi, ${me.firstName}`}
                id={`offcanvasNavbarDropdown-expand-xl`}
              >
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">Logout</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <div className="d-block d-sm-none">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">Chat system</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto ">
                <Nav.Link href="#link">Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <Outlet></Outlet>
    </div>
  );
};
