import React, { useEffect, useState } from "react";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Form,
} from "react-bootstrap";
import { Review, ReviewForm } from "../../types/types";
import { getReviewsByUsername } from "../api/UserApiService";
import { updateReviewApi, deleteReviewApi } from "../api/ReviewApiService";
import { useAuth } from "../security/AuthContext";
import { toast, ToastContainer } from "react-toastify";

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<ReviewForm>({ rating: 0, title: "", text: "" });
  const authContext = useAuth();
  const username = authContext.username;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getReviewsByUsername(username);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Error fetching reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [username]);

  const handleEditClick = (review: Review) => {
    setEditingReview(review.id);
    setFormValues({ rating: review.rating, title: review.title, text: review.text });
  };

  const handleUpdate = async (product_id: number, review_id: number) => {
    if (!username) return;
    try {
      await updateReviewApi(product_id, review_id, formValues);
      setEditingReview(null);
      const response = await getReviewsByUsername(username);
      setReviews(response.data);
      toast.success("Değerlendirme başarıyla güncellendi!");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Değerlendirme güncellenirken hata. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  const handleDelete = async (product_id: number, review_id: number) => {
    try {
      await deleteReviewApi(product_id, review_id);
      toast.success("Değerlendirme başarıyla silindi!");
      setReviews(reviews.filter((review) => review.id !== review_id));
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Değerlendirme silinirken hata. Lütfen daha sonra tekrar deneyiniz.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "rating") {
      const numericValue = Math.max(1, Math.min(5, Number(value)));
      setFormValues({ ...formValues, [name]: numericValue });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        Herhangi bir değerlendirme bulunamadı.
      </Alert>
    );
  }

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
                  {editingReview === review.id ? (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Puanınız (1-5)</Form.Label>
                        <Form.Control
                          type="number"
                          name="rating"
                          min="1"
                          max="5"
                          value={formValues.rating}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Başlık</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formValues.title}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Değerlendirme Metni</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="text"
                          rows={3}
                          value={formValues.text}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={() => handleUpdate(review.product.id, review.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={() => setEditingReview(null)}
                      >
                        Cancel
                      </Button>
                    </Form>
                  ) : (
                    <Card.Text>
                      <div>{review.rating}/5 - {review.title}</div>
                      <div>{review.text}</div>
                    </Card.Text>
                  )}
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroupItem>Puan: {review.rating}/5</ListGroupItem>
                  <ListGroupItem>
                    Tarih: {new Date(review.updatedAt).toLocaleDateString()}
                  </ListGroupItem>
                </ListGroup>
                {!editingReview && (
                  <Card.Body>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => handleEditClick(review)}
                    >
                      Güncelle
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(review.product.id, review.id)}
                    >
                      Sil
                    </Button>
                  </Card.Body>
                )}
              </Card>
            </Col>
          ))
        ) : (
          <p>Henüz bir değerlendirmeniz yok.</p>
        )}
      </Row>

      <ToastContainer />

    </Container>
  );
};

export default Reviews;
