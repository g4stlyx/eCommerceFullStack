import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../types/types";
import { searchAndFilterProductsApi } from "./api/ProductApiService";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { addItemToWishlistApi } from "./api/WishlistApiService";
import { addItemToCartApi } from "./api/CartApiService";

const ProductsByCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await searchAndFilterProductsApi({ category });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products: " + err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <br />
      <h2>{category} Ürünleri</h2>
      <br />
      <div className="products-grid" style={{ margin: "5px 25px" }}>
        <Row xs={1} md={3} className="g-4">
          {products.length > 0 ? (
            products.map((product) => (
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
            ))
          ) : (
            <div>Bu kategoriye ait ürün bulunamadı.</div>
          )}
        </Row>
      </div>

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
    </div>
  );
};

export default ProductsByCategory;
