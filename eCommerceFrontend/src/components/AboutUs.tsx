import React from 'react';
import { Container, Row, Col, Image, Card, ListGroup } from 'react-bootstrap';

const AboutUs: React.FC = () => {
  return (
    <div className="py-5">
      <Container>
        {/* Introduction Section */}
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <h2 className="display-4">About Us</h2>
            <p className="lead">
              Welcome to our e-commerce platform, where quality meets excellence. Our mission is to provide the best products and services, ensuring customer satisfaction at every step.
            </p>
            <p>
              We believe in the power of innovation and strive to bring you the latest trends and technology. Our team is dedicated to making your shopping experience seamless and enjoyable.
            </p>
          </Col>
          <Col md={6}>
            <Image
              src="https://via.placeholder.com/600x400"
              fluid
              rounded
              className="shadow"
            />
          </Col>
        </Row>

        {/* Vision, Mission, Values */}
        <Row className="mb-5">
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Our Vision</Card.Title>
                <Card.Text>
                  To be the leading e-commerce platform, setting benchmarks for quality, innovation, and customer satisfaction.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Our Mission</Card.Title>
                <Card.Text>
                  To offer a wide range of high-quality products at competitive prices, ensuring a seamless shopping experience for our customers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Our Values</Card.Title>
                <Card.Text>
                  Integrity, customer focus, and continuous improvement are the core values that drive us to excel in what we do.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="mb-5">
          <Col>
            <h3 className="mb-4">Meet Our Team</h3>
            <Row>
              <Col md={4}>
                <Card className="shadow-sm">
                  <Card.Body className="text-center">
                    <Image
                      src="https://via.placeholder.com/150"
                      roundedCircle
                      fluid
                      className="mb-3"
                    />
                    <Card.Title>John Doe</Card.Title>
                    <Card.Text>CEO & Founder</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm">
                  <Card.Body className="text-center">
                    <Image
                      src="https://via.placeholder.com/150"
                      roundedCircle
                      fluid
                      className="mb-3"
                    />
                    <Card.Title>Jane Smith</Card.Title>
                    <Card.Text>Chief Marketing Officer</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm">
                  <Card.Body className="text-center">
                    <Image
                      src="https://via.placeholder.com/150"
                      roundedCircle
                      fluid
                      className="mb-3"
                    />
                    <Card.Title>Emily Johnson</Card.Title>
                    <Card.Text>Head of Operations</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Timeline Section */}
        <Row className="mb-5">
          <Col>
            <h3 className="mb-4">Our Journey</h3>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>2015:</strong> Our company was founded with a vision to revolutionize e-commerce.
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>2017:</strong> Launched our first online store and reached our first 10,000 customers.
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>2019:</strong> Expanded to international markets and introduced new product lines.
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>2022:</strong> Achieved over 1 million customers worldwide and launched our mobile app.
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>

        {/* Testimonials Section */}
        <Row className="mb-5">
          <Col>
            <h3 className="mb-4">What Our Customers Say</h3>
            <Row>
              <Col md={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Text>
                      "This platform has completely transformed my shopping experience. The quality of products is unmatched."
                    </Card.Text>
                    <Card.Footer className="text-muted">- Sarah W.</Card.Footer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Text>
                      "Amazing customer service and fast delivery. I always find what I'm looking for."
                    </Card.Text>
                    <Card.Footer className="text-muted">- James T.</Card.Footer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Text>
                      "The user experience on this site is top-notch. It's my go-to for online shopping."
                    </Card.Text>
                    <Card.Footer className="text-muted">- Linda K.</Card.Footer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;
