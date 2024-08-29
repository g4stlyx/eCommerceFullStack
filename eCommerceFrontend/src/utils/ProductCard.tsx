import React from "react";
import { Button, Card, Col } from "react-bootstrap";
import { handleAddToCart, handleAddToWishlist } from "./utils";
import { Product } from "../types/types";
import { useModalAndToast } from "./useModalAndToast";

function ProductCard({ product }: { product: Product }) {
  const { setShowModal, setModalMessage } = useModalAndToast();

  return (
    <Col key={product.id}>
      <Card className="h-100">
        <a href={`/products/${product.id}`} className="text-decoration-none">
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
                  handleAddToCart(product.id, setShowModal, setModalMessage);
                }}
              >
                Sepete Ekle
              </Button>
              <Button
                variant="outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(
                    product.id,
                    setShowModal,
                    setModalMessage
                  );
                }}
              >
                Favorilere Ekle
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ProductCard;
