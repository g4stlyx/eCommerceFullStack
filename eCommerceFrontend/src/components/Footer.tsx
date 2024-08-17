import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer : React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>About Us</h5>
            <p>
              Your one-stop shop for all your shopping needs. Explore our wide range of products and categories.
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/products" className="text-white">Products</a></li>
              <li><a href="/wishlist" className="text-white">Wishlist</a></li>
              <li><a href="/cart" className="text-white">Cart</a></li>
              <li><a href="/account" className="text-white">Account</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Follow Us</h5>
            <div>
              <a href="https://facebook.com" className="text-white me-3">
                <FaFacebook size={30} />
              </a>
              <a href="https://twitter.com" className="text-white me-3">
                <FaTwitter size={30} />
              </a>
              <a href="https://instagram.com/sefa.js" className="text-white">
                <FaInstagram size={30} />
              </a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="mt-3">
            <p className="mb-0">&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
