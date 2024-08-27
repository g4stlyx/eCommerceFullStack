import React, { useEffect, useState } from "react";
import { CartItem, WishlistItem } from "../../types/types";
import { Link, useNavigate } from "react-router-dom";
import {
  addItemToCartApi,
  getCartApi,
  removeItemFromCartApi,
  updateItemQuantityApi,
} from "../api/CartApiService";
import { getWishlistApi } from "../api/WishlistApiService";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  ToastContainer,
  Image,
  Modal,
} from "react-bootstrap";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import "../../styles/cart.css";
import "../../styles/productDetailed.css"
import { toast } from "react-toastify";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCartApi();
      setCartItems(response.data.cartItems);
      calculateTotalPrice(response.data.cartItems);
    } catch (error) {
      setError("Failed to fetch cart: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await getWishlistApi();
      setWishlistItems(response.data.wishlistItems);
    } catch (error) {
      setError("Failed to fetch wishlist: " + error);
    }
  };

  const calculateTotalPrice = (items: CartItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await updateItemQuantityApi(itemId, newQuantity);
      const updatedItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
    } catch (error) {
      setError("Failed to update quantity: " + error);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await removeItemFromCartApi(itemId);
      fetchCart();
    } catch (error) {
      setError("Failed to remove item: " + error);
    }
  };

  const handlePrev = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === 0 ? wishlistItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex === wishlistItems.length - 1 ? 0 : prevIndex + 1
    );
  };

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

  if (loading) {
    return (
      <Container className="my-4 text-center">
        <Spinner animation="border" />
        <div>Yükleniyor..</div>
      </Container>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Container>
        <br />
        <h1>Sepetim</h1>
        <br />
        {!cartItems || cartItems.length === 0 ? (
          <>
            <p>
              Sepetiniz boş, <a href="/">aramaya devam edin.</a>
            </p>
            <h2 className="mt-5">Favorileriniz</h2>
            <br />
            <Container fluid className="carousel-container position-relative">
              <Row className="g-3">
                {wishlistItems
                  .slice(carouselIndex, carouselIndex + 4)
                  .map((wishlistItem) => (
                    <Col key={wishlistItem.id} xs={12} sm={6} md={4} lg={3}>
                      <Card className="text-center h-100">
                        <Link to={`/products/${wishlistItem.id}`}>
                          <Image
                            src={wishlistItem.product.imgSrc}
                            alt={wishlistItem.product.name}
                            fluid
                            className="carousel-img"
                          />
                        </Link>
                        <Card.Body className="d-flex flex-column">
                          <div className="mt-auto">
                            <Card.Title>{wishlistItem.product.name}</Card.Title>
                            <Card.Text>
                              ${wishlistItem.product.price.toFixed(2)}
                            </Card.Text>
                            <Button
                              variant="primary"
                              onClick={() => handleAddToCart(wishlistItem.id)}
                            >
                              <FaShoppingCart /> Sepete Ekle
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
          </>
        ) : (
          <Row>
            <Col xs={12} md={8}>
              {cartItems.map((item) => (
                <Card key={item.id} className="cart-item mb-3">
                  <Row className="align-items-center">
                    <Col xs={3}>
                      <Card.Img
                        src={item.product.imgSrc}
                        alt={item.product.name}
                        className="cart-item-image"
                      />
                    </Col>
                    <Col xs={6}>
                      <Card.Body>
                        <Card.Title className="font-weight-bold cart-item-title">
                          {item.product.name}
                        </Card.Title>
                        <Card.Text className="text-muted cart-item-description">
                          {item.product.description}
                        </Card.Text>
                        <div className="d-flex align-items-center">
                          {item.quantity === 1 ? (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <FaTrashAlt />
                            </Button>
                          ) : (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              -
                            </Button>
                          )}
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </Card.Body>
                    </Col>
                    <Col xs={3} className="text-right">
                      <Card.Body>
                        <Card.Text className="cart-item-price">
                          {(item.product.price * item.quantity).toFixed(2)} ₺
                        </Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Col>
            <Col xs={12} md={4}>
              <Card className="checkout-card">
                <Card.Body>
                  <h3>Toplam: {totalPrice.toFixed(2)} ₺</h3>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/checkout")}
                  >
                    Ödemeye Git
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

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

            }}
          >
            Login / Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cart;
