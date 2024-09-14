import React, { useEffect, useState } from "react";
import { getAllReviewsApi, deleteReviewApi } from "../api/ReviewApiService";
import { Alert, Button, ListGroup, Spinner } from "react-bootstrap";
import { Review } from "../../types/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllReviewsApi();
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
      setError("Error fetching reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (product_id: number, review_id: number) => {
    try {
      await deleteReviewApi(product_id, review_id);
      setReviews(reviews.filter((review) => review.id !== review_id));
      toast.success("Değerlendirme başarıyla silindi.");
    } catch (error) {
      console.error("Error deleting review", error);
      toast.error("Değerlendirme silinirken hata!: " + error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Tüm Değerlendirmeler</h2>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : reviews.length === 0 ? (
        <Alert variant="info" className="text-center">
          Herhangi bir değerlendirme bulunamadı.
        </Alert>
      ) : (
        <ListGroup className="shadow-sm">
          {reviews.map((review) => (
            <ListGroup.Item
              key={review.id}
              className="d-flex justify-content-between align-items-center py-3 px-4 border-0 border-bottom"
              style={{ backgroundColor: "#f9f9f9", borderRadius: "0.25rem" }}
            >
              <div>
                <h5
                  className="mb-1"
                  style={{ fontWeight: "bold", color: "#333", textAlign:"left" }}
                >
                  {review.title}{" "}
                  <span style={{ fontSize: "0.85rem", color: "#666" }}>
                    ({review.user.username} tarafından)
                  </span>
                </h5>
                <p className="mb-1" style={{ color: "#555" }}>
                  {review.text}
                </p>
                <p className="mb-0" style={{ fontWeight: "500", textAlign:"left" }}>
                  Rating:{" "}
                  <span style={{ color: "#007bff" }}>{review.rating}</span>
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => deleteReview(review.product.id, review.id)}
                className="ml-3"
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminReviews;
