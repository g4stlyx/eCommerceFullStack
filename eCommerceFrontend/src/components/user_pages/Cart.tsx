import React, { useEffect, useState } from "react";
import { CartItem, WishlistItem } from "../../types/types";
import { useNavigate } from "react-router-dom";
import {
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
} from "react-bootstrap";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import "../../styles/cart.css";
import "../../styles/productDetailed.css";
import LoginModal from "../../utils/LoginModal";
import { handleAddToCart } from "../../utils/utils";
import { useModalContext } from "../../context/ModalContext";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const navigate = useNavigate();
  const {setShowModal, setModalMessage} = useModalContext();

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
                        <a href={`/products/${wishlistItem.product.id}`}>
                          <Card.Img
                            src={wishlistItem.product.imgSrc}
                            alt={wishlistItem.product.name}
                            className="carousel-img"
                          />
                        </a>
                        <Card.Body className="d-flex flex-column">
                          <div className="mt-auto">
                            <Card.Title>{wishlistItem.product.name}</Card.Title>
                            <Card.Text>
                              ${wishlistItem.product.price.toFixed(2)}
                            </Card.Text>
                            <Button
                              variant="primary"
                              onClick={() => handleAddToCart(wishlistItem.id, setShowModal, setModalMessage)}
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
                      <a href={`/products/${item.product.id}`}>
                        <Card.Img
                          src={item.product.imgSrc}
                          alt={item.product.name}
                          className="cart-item-image"
                        />
                      </a>
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
                          <div>{item.product.price.toFixed(2)} $</div>
                          <div>({item.quantity} adet)</div>
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
      <LoginModal />
    </>
  );
};

export default Cart;
