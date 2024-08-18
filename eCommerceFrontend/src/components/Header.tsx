import React from 'react';
import "../styles/header.css"
import "../styles/App.css"
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const Header : React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className='header'>
      <Container>
        <Navbar.Brand href="/">E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/products">Products</Nav.Link>
            <NavDropdown title="Categories" id="basic-nav-dropdown">
              <NavDropdown.Item href="/categories/electronics">Electronics</NavDropdown.Item>
              <NavDropdown.Item href="/categories/clothing">Clothing</NavDropdown.Item>
              <NavDropdown.Item href="/categories/home">Home</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav className="ms-auto">
            <Nav.Link href="/cart">Cart</Nav.Link>
            <Nav.Link href="/wishlist">Wishlist</Nav.Link>
            <Nav.Link href="/account">Account</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;