import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavMenu = () => {
  const navigate = useNavigate();


  const handleLogoutClick = () => {
    sessionStorage.removeItem("user");
    window.location.href = "/user/login"
  }
  const handleHomeClick = () => {
    window.location.href = '/';
  };

const user = sessionStorage.getItem("user")
var userVl = JSON.parse(user);

  return (
    <Navbar 
      fixed="top" 
      bg="white" 
      expand="lg" 
      className="shadow-sm py-1"
    >
      <Container>
        <Navbar.Brand 
          onClick={handleHomeClick}
          className="brand-logo-enhanced py-0"
          style={{ cursor: 'pointer' }}
        >
          <span className="logo-text">Aplzz</span>
          <div className="logo-dot"></div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              onClick={handleHomeClick}
              className="mx-2 fw-medium py-1"
            >
              <i className="bi bi-house-door me-2"></i>
              Hjem
            </Nav.Link>
            {userVl ? (
              <><Nav.Link
                onClick={() => navigate('/posts/create')}
                className="mx-2 fw-medium py-1">
                <i className="bi bi-plus-lg me-2"></i>
                Nytt innlegg
              </Nav.Link>
              <Nav.Link 
              onClick={() => navigate(`/profile/${userVl.username}`)}
              className="mx-2 fw-medium py-1">
                  <i className="bi bi-person-circle me-2"></i>
                  {userVl.username}
                </Nav.Link>
                <Nav.Link 
              onClick={handleLogoutClick}
              className="mx-2 fw-medium py-1">
                  <i className="bi-box-arrow-in-left"></i>
                  Logg av
                </Nav.Link></>
            ) : (
              <><Nav.Link
                onClick={() => navigate('/user/login')}
                className="mx-2 fw-medium py-1">
                <i class="bi-box-arrow-in-right"></i> Logg inn
              </Nav.Link></>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;