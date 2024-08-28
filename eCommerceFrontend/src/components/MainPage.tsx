import React, { useEffect, useState } from "react";
import { Category, Product } from "../types/types";
import { getAllProductsApi } from "./api/ProductApiService";
import { getAllCategoriesApi } from "./api/CategoryApiService";
import { Container, Row, Col, Card, ListGroup, Button, Modal } from "react-bootstrap";
import "../styles/mainPage.css";
import { addItemToWishlistApi } from "./api/WishlistApiService";
import { toast, ToastContainer } from "react-toastify";
import { addItemToCartApi } from "./api/CartApiService";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProductsApi();
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesApi();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddToCart = (id: number) => {
    addItemToCartApi(id)
      .then(() => {
        toast.success("Ürün sepete eklendi!");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setModalMessage(
            "Sepetinize ürün eklemek için üye olmanız gerekmektedir."
          );
          setShowModal(true);
        } else {
          toast.error("Ürün sepetinize eklenemedi.");
        }
      });
  };

  const handleAddToWishlist = (id: number) => {
    addItemToWishlistApi(id)
      .then(() => {
        toast.success("Ürün favorilere eklendi!");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setModalMessage(
            "Favorilerinize ürün eklemek için üye olmanız gerekmektedir."
          );
          setShowModal(true);
        } else {
          toast.error("Ürün favorilerinizde zaten mevcut.");
        }
      });
  };

  return (
    <Container fluid className="main-page">
      <Row>
        {/* Categories Side Menu */}
        <Col md={3} className="categories-left-menu">
          <Card className="mb-4">
            <Card.Header as="h4">Categories</Card.Header>
            <ListGroup variant="flush">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/categories/${category.name}`}
                  className="text-decoration-none"
                >
                  <ListGroup.Item className="category-item">
                    {category.name}
                  </ListGroup.Item>
                </a>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Product Grid */}
        <Col md={9}>
          <Row xs={1} md={3} className="g-4">
            {products.map((product) => (
              <Col key={product.id}>
                  <Card className="h-100">
                  <a
                  href={`/products/${product.id}`}
                  className="text-decoration-none"
                >
                    <Card.Img
                      variant="top"
                      src={product.imgSrc}
                      alt={product.name}
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                    </a>
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>{product.price} $</Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-around">
                          <Button
                            variant="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product.id);
                            }}
                          >
                            Sepete Ekle
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWishlist(product.id);
                            }}
                          >
                            Favorilere Ekle
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Modal for login/signup */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Üye Olmanız Gerekiyor.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Kapat
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            Giriş Yap
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              navigate("/sign-up");
            }}
          >
            Üye Ol
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MainPage;
