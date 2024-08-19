import React from 'react';
import "../styles/App.css"
import "../styles/footer.css"
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer : React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>Hakkımızda</h5>
            <p>
              güzel ürünler satıyoruz
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Hızlı Linkler</h5>
            <ul className="list-unstyled">
              <li><a href="/products" className="text-white">Ürünler</a></li>
              <li><a href="/wishlist" className="text-white">Favorilerim</a></li>
              <li><a href="/cart" className="text-white">Sepetim</a></li>
              <li><a href="/account" className="text-white">Hesabım</a></li>
            </ul>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Bizi Takip Edin</h5>
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
            <p className="mb-0">&copy; {new Date().getFullYear()} g-commerce. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
