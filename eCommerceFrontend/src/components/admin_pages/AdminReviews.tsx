import React, { useEffect, useState } from 'react';
import { getAllReviewsApi, deleteReviewApi } from '../api/ReviewApiService';
import { Button, ListGroup } from 'react-bootstrap';
import { Review } from '../../types/types';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await getAllReviewsApi();
      setReviews(response.data);
      
    } catch (error) {
      console.error('Error fetching reviews', error);
    }
  };

  const deleteReview = async (product_id: number, review_id:number) => {
    try {
      await deleteReviewApi(product_id, review_id);
      setReviews(reviews.filter(review => review.id !== review_id));
      toast.success("Değerlendirme başarıyla silindi.")
    } catch (error) {
      console.error('Error deleting review', error);
      toast.error("Değerlendirme silinirken hata!: " + error)
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tüm Değerlendirmeler</h2> <br />
      <ListGroup>
        {reviews.map(review => (
          <ListGroup.Item key={review.id} className="d-flex justify-content-between align-items-center">
            <div>
              <h5 style={{textAlign:"left"}}>{review.title} ({review.user.username} tarafından)</h5>
              <p style={{textAlign:"left"}}>{review.text}</p>
              <p style={{textAlign:"left"}}>Rating: {review.rating}</p>
            </div>
            <Button variant="danger" onClick={() => deleteReview(review.product.id, review.id)}>
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <ToastContainer />
    </div>
  );
};

export default AdminReviews;

