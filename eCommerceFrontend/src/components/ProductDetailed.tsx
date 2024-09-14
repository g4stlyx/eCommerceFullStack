import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProductByIdApi,
  searchAndFilterProductsApi,
} from "./api/ProductApiService";
import { handleAddToCart, handleAddToWishlist } from "../utils/utils";
import {
  getReviewsByProductIdApi,
  createReviewApi,
} from "./api/ReviewApiService";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Card,
  Form,
  Spinner,
} from "react-bootstrap";
import { Product, Review } from "../types/types";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/productDetailed.css";
import LoginModal from "../utils/LoginModal";
import { useModalContext } from "../context/ModalContext";

const ProductDetailed: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(1);
  const { setModalMessage, setShowModal } = useModalContext();

  useEffect(() => {
    getProductByIdApi(Number(productId))
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => console.error(error));
  }, [productId]);

  useEffect(() => {
    if (product?.category?.name) {
      searchAndFilterProductsApi({ category: product.category.name })
        .then((response) => setRelatedProducts(response.data))
        .catch((error) => console.error(error));
    }
  }, [product?.category?.name]); // Only re-run when the category name changes

  useEffect(() => {
    getReviewsByProductIdApi(Number(productId))
      .then((response) => setReviews(response.data))
      .catch((error) => console.log(error));
  }, [productId]);

  if (!product)
    return (
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Spinner animation="border" />
      </div>
    );

  const handlePrev = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === 0 ? relatedProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === relatedProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReviewApi(Number(productId), {
      title: reviewTitle,
      text: reviewText,
      rating: reviewRating,
    })
      .then(() => {
        toast.success("Değerlendirme başarılı.");
      })
      .catch((err) => {
        toast.error("Değerlendirme başarısız: ", err);
      });

    setShowReviewForm(false);
  };

  return (
    <>
      <Container className="product-detailed my-4">
        {/* Category */}
        <p className="text-muted small" style={{ textAlign: "left" }}>
          {product.category.name}
        </p>

        <Row className="align-items-center">
          <Col md={6}>
            {/* Product Image */}
            <Image
              src={product.imgSrc}
              alt={product.name}
              fluid
              className="product-image"
            />
          </Col>
          <Col md={6}>
            {/* Product Info */}
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Quantity: {product.quantity}</p>
            <p className="text-primary h4">${product.price.toFixed(2)}</p>
            {/* Centered Buttons */}
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button
                variant="primary"
                onClick={() =>
                  handleAddToCart(product.id, setShowModal, setModalMessage)
                }
              >
                Sepete ekle
              </Button>
              <Button
                variant="outline-primary"
                onClick={() =>
                  handleAddToWishlist(product.id, setShowModal, setModalMessage)
                }
              >
                Favorilere ekle
              </Button>
            </div>
          </Col>
        </Row>

        {/* Similar Products */}
        <h2 className="mt-5">Benzer Ürünler</h2>
        <Container fluid className="carousel-container position-relative">
          <Row className="g-3">
            {relatedProducts
              .slice(carouselIndex, carouselIndex + 4)
              .map((relatedProduct) => (
                <Col key={relatedProduct.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="text-center h-100">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <Image
                        src={relatedProduct.imgSrc}
                        alt={relatedProduct.name}
                        fluid
                        className="carousel-img"
                      />
                    </Link>
                    <Card.Body className="d-flex flex-column">
                      <div className="mt-auto">
                        <Card.Title>{relatedProduct.name}</Card.Title>
                        <Card.Text>
                          ${relatedProduct.price.toFixed(2)}
                        </Card.Text>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleAddToCart(
                              relatedProduct.id,
                              setShowModal,
                              setModalMessage
                            )
                          }
                        >
                          <FaShoppingCart /> Sepete Ekle
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="mt-2"
                          onClick={() =>
                            handleAddToWishlist(
                              relatedProduct.id,
                              setShowModal,
                              setModalMessage
                            )
                          }
                        >
                          <FaHeart /> Favorilere Ekle
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>

          {/* Custom left and right buttons */}
          <Button className="carousel-control-prev" onClick={handlePrev}>
            &lsaquo;
          </Button>
          <Button className="carousel-control-next" onClick={handleNext}>
            &rsaquo;
          </Button>
        </Container>

        {/* Reviews */}
        <h2 className="mt-5">Değerlendirmeler</h2>
        {reviews.length ? (
          reviews.map((review) => (
            <Card key={review.id} className="my-3">
              <Card.Body>
                <Card.Title>
                  {review.title} - {review.rating}/5
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  By {review.user.username} on{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </Card.Subtitle>
                <Card.Text>{review.text}</Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div>
            <p>Henüz bir değerlendirme yapılmadı.</p>
          </div>
        )}

        {/* Write a Review Button */}
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Değerlendir
        </Button>

        {/* Review Form */}
        {showReviewForm && (
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={handleReviewSubmit}>
                <Form.Group className="mb-3" controlId="reviewTitle">
                  <Form.Label>Başlık</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="reviewText">
                  <Form.Label>Değerlendirmeniz</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="reviewRating">
                  <Form.Label>Derecesi ?/5</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Rate out of 5"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    min={1}
                    max={5}
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit">
                  Değerlendir
                </Button>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Modal for login/signup */}
      <LoginModal />
    </>
  );
};

export default ProductDetailed;
