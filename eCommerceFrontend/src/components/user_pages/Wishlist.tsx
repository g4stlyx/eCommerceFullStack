import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWishlistApi,
  removeItemFromWishlistApi,
} from "../api/WishlistApiService";
import { WishlistItem } from "../../types/types";
import {
  Card,
  Button,
  Image,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useModalAndToast } from "../../utils/useModalAndToast";
import { handleAddToCart } from "../../utils/utils";

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {setShowModal, setModalMessage} = useModalAndToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlistApi();
      setWishlistItems(response.data.wishlistItems);
    } catch (error) {
      setError("Failed to fetch wishlist: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistItemId: number) => {
    try {
      await removeItemFromWishlistApi(wishlistItemId);
      setWishlistItems(
        wishlistItems.filter((item) => item.id !== wishlistItemId)
      );
      toast.success("Item removed from wishlist!");
    } catch (error) {
      toast.error("Failed to remove item from wishlist: " + error);
    }
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
        <h1>Favorilerim</h1>
        <br />
        {!wishlistItems || wishlistItems.length === 0 ? (
          <p>
            Favorileriniz boş, <a href="/">aramaya devam edin.</a>
          </p>
        ) : (
          <Row className="g-3">
            {wishlistItems.map((item) => (
              <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="d-flex flex-column h-100">
                  <Card.Body
                    className="d-flex flex-column"
                    onClick={() => navigate(`/products/${item.product.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      src={item.product.imgSrc}
                      alt={item.product.name}
                      fluid
                      className="mb-3"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <Card.Title>{item.product.name}</Card.Title>
                      <Card.Text>{item.product.description}</Card.Text>
                    </div>
                    <div className="mt-auto">
                      <Card.Text>Price: ${item.product.price}</Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.product.id, setShowModal, setModalMessage);
                          }}
                        >
                          Sepete Ekle
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromWishlist(item.id);
                          }}
                        >
                          Favorilerden Kaldır
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <ToastContainer />
    </>
  );
};

export default Wishlist;
