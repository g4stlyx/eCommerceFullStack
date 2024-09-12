import React, { useEffect, useState } from 'react';
import { Card, ListGroup, ListGroupItem, Container, Row, Col } from 'react-bootstrap';
import { Review } from '../../types/types';
import { getReviewsByUsername } from '../api/UserApiService';
import { useAuth } from '../security/AuthContext';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const authContext = useAuth();
  const username = authContext.username;

  useEffect(() => {
    if (!username) return;

    const fetchReviews = async () => {
      try {
        const response = await getReviewsByUsername(username);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);


  return (
    <Container>
      <h2 className="my-4">Değerlendirmeleriniz</h2>
      <Row>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Col key={review.id} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{review.product.name}</Card.Title>
                  <Card.Text>
                    <div>{review.rating} - {review.title}</div>
                    <div>{review.text}</div>
                  </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>Rating: {review.rating}/5</ListGroupItem>
                  <ListGroupItem>Date: {new Date(review.updatedAt).toLocaleDateString()}</ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          ))
        ) : (
          <p>Henüz bir değerlendirmeniz yok.</p>
        )}
      </Row>
    </Container>
  );
};

export default Reviews;