import React from 'react';
import NavBar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import { AppContext } from '../lib';

const styles = {
  navbar: {
    backgroundImage: 'linear-gradient(#e86a0c, #fe4900)',
    height: '4rem'
  },
  offCanvas: {
    backgroundImage: 'linear-gradient(#e86a0c, #fe4900)',
    width: '200px'
  },
  offCanvasTitle: {
    color: '#FFFFFF'
  },
  logo: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'auto'
  }
};

export default class Navigation extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;
    const display = !user
      ? {
          authLink: '#log-in',
          authAction: null,
          authText: 'Log In'
        }
      : {
          authLink: '#',
          authAction: handleSignOut,
          authText: 'Log Out'
        };
    return (
      <NavBar
        collapseOnSelect
        className='shadow py-0'
        style={styles.navbar}
        expand='md'
        fixed='top' >
        <Container fluid>
          <a
            style={styles.logo}
            href='#' >
            <img
              src='/images/logo.png'
              alt='logo' />
          </a>
          <NavBar.Toggle
            className='shadow-none border-0'
            style={styles.menuIcon}
            aria-controls='offcanvasNavbar-expand-md' />
          <NavBar.Offcanvas
            className='side-navbar'
            style={styles.offCanvas}
            id='offcanvasNavbar-expand-md'
            responsive='md'
            aria-labelledby='offcanvasNavbarLabel-expand-md' >
            <Offcanvas.Header
              closeButton
              className='close-button' >
              <Offcanvas.Title
                className='fw-bold'
                style={styles.offCanvasTitle}
                id='offcanvasNavbarLabel-expand-md' >
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="pe-0 w-100">
                <Nav.Link
                  className='nav-link'
                  href=' ' >
                  Home
                </Nav.Link>
                <Nav.Link
                  className='nav-link'
                  href='#roulette' >
                  Roulette
                </Nav.Link>
                <Nav.Link
                  className='nav-link'
                  href='#favorites' >
                  Favorites
                </Nav.Link>
                <Nav.Link
                  className='nav-link nav-link-login'
                  href={display.authLink}
                  onClick={display.authAction} >
                  {display.authText}
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </NavBar.Offcanvas>
        </Container>
      </NavBar>
    );
  }
}

Navigation.contextType = AppContext;
