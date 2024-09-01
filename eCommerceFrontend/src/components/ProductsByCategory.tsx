import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../types/types";
import { searchAndFilterProductsApi } from "./api/ProductApiService";
import { Button, Modal, Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import ProductCard from "../utils/ProductCard";
import { useModalContext } from "../context/ModalContext";

const ProductsByCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setShowModal, showModal, modalMessage } = useModalContext();

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
            products.map((product) => <ProductCard product={product} key={product.id} />)
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
      </Modal>{" "}
    </div>
  );
};

export default ProductsByCategory;
